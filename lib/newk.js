const { _, log } = require('basd')
const Crypto = require('crpdo')
const Registry = require('@basd/registry')

const { DEFAULT_TRANSPORT } = require('./core/const')

const Router = require('./core/router')
const BaseTransport = require('./core/transport')
const BusTransport = require('./transports/bus-transport')
const NknTransport = require('./transports/nkn-transport')
const NknConnect = require('./modules/nkn-connect')

const TransportDecorator = require('./core/decorator')
const PubSubDecorator = require('./decorators/pubsub-decorator')
const EntryDecorator = require('./decorators/entry-decorator')
const SeederDecorator = require('./decorators/entry-decorator')
const EncryptionDecorator = require('./decorators/encryption-decorator')

/**
 * Main class for creating a network communication instance with various transport and decorator options.
 */
class Newk {
  static get DEFAULT_TRANSPORT() { return DEFAULT_TRANSPORT }
  /**
   * Retrieves the available classes for transports and decorators.
   * @returns {Object} An object containing transport and decorator class mappings.
   */
  static get classes() {
    return {
      transport: {
        bus: BusTransport,
        nkn: NknTransport,
      },
      decorator: {
        pubsub: PubSubDecorator,
        entry: EntryDecorator,
        seeder: SeederDecorator,
        encryption: EncryptionDecorator,
      },
    }
  }

  /**
   * Initializes a new Newk instance with options and transport.
   * @param {Object|string} opts - Options for the instance or the identifier.
   * @param {Object} [transport] - Transport configuration or instance.
   */
  constructor(opts, transport) {
    if (_.isNil(opts))
      opts = {}
    if (_.isString(opts)) {
      if (_.isObj(transport)) {
        opts = { identifier: opts, ...transport }
        transport = null
      } else {
        opts = { identifier: opts }
      }
      opts.seed = opts.seed || Crypto.hash(opts.identifier) // @tmp
    }
    opts.transport = transport || opts.transport || this.constructor.DEFAULT_TRANSPORT
    _.objProp(this, 'registry', Registry.get(opts))
    this.registry.setMany(_.merge({}, this.constructor.classes, opts.classes))
    transport = this.registry.createInstance([`transport`, opts.transport], BaseTransport, opts)
    if (opts.decorators) {
      for (let decoratorClass of opts.decorators) {
        let decoratorOpts = { ...opts }
        if (_.isArray(decoratorClass))
          [decoratorClass, decoratorOpts] = decoratorClass
        if (_.isString(decoratorClass)) {
          decoratorClass = this.registry.get(['decorator', decoratorClass])
        }
        if (!this.registry.isValidClass(decoratorClass, TransportDecorator))
          throw new Error(`Invalid decorator class`)
        transport = new decoratorClass(transport, decoratorOpts)
      }
    }
    _.objProp(this, 'transport', transport, { show: true })
    _.objProp(this, 'router', new Router(opts))
    if (opts.onMessage) {
      this.onMessage(opts.onMessage)
    } else {
      this.onMessage(this.receive.bind(this))
    }
  }

  /**
   * Gets the address associated with the transport layer.
   * @returns {string} The address of the transport.
   */
  get addr() {
    return this.transport.addr
  }

  /**
   * Checks if the transport layer is ready.
   * @returns {Promise<void>} A promise that resolves when the transport is ready.
   */
  async isReady() {
    await this.transport.isReady()
  }

  /**
   * Initializes and returns a Newk instance after ensuring it is ready.
   * @param {...*} args - Arguments to pass to the constructor.
   * @returns {Promise<Newk>} A promise that resolves to the ready Newk instance.
   */
  static init(...args) {
    const newk = new this(...args)
    return newk.isReady().then(() => newk)
  }

  /**
   * Adds a route to the router.
   * @param {string} action - The action that the route corresponds to.
   * @param {Function} handler - The handler function for the route.
   * @returns {*} The result of the route addition.
   */
  addRoute(action, handler) {
    return this.router.addRoute(action, handler)
  }

  /**
   * Adds multiple routes from an object with handlers.
   * @param {Object} obj - The object containing methods that represent routes.
   * @param {string} [path] - An optional path prefix for the routes.
   * @returns {*} The result of adding the routes.
   */
  addRoutes(obj, path) {
    return this.router.addRoutes(obj, path)
  }

  /**
   * Sends a message to the specified destination.
   * @param {string|Object} dest - The destination address or object with address.
   * @param {*} payload - The payload to send.
   * @param {Object} [opts] - Optional parameters for sending the message.
   * @returns {Promise<*>} A promise that resolves with the response from the destination.
   */
  async send(dest, payload, opts) {
    dest = _.isObj(dest) ? dest.addr : dest
    return this.transport.send(dest, payload, opts)
  }

  /**
   * Dispatches a typed message to a specific destination.
   * @param {string} dest - The destination address.
   * @param {string} type - The type of the message to dispatch.
   * @param {*} data - The data to include in the message.
   * @param {Object} [opts] - Optional parameters for the dispatch.
   * @returns {Promise<*>} A promise that resolves with the decoded response.
   */
  async dispatch(dest, type, data, opts) {
    const payload = _.msgpack.encode([type, data])
    return this.send(dest, payload, opts)
      .then(response => _.msgpack.decode(response))
  }

  /**
   * Handles incoming messages.
   * @param {Object} param - An object containing the payload and source.
   * @returns {Promise<*>} A promise that resolves with the encoded response.
   */
  async receive({ payload, src }) {
    const [type, data] = _.msgpack.decode(payload)
    return Promise.resolve(this.router.execute(type, data, src))
      .then(response => _.msgpack.encode(response))
  }

  /**
   * Registers a message handler.
   * @param {Function} handler - The function to handle incoming messages.
   */
  onMessage(handler) {
    this.transport.onMessage(handler)
  }

  // PubSub
  /**
   * Subscribes to a given topic.
   * @param {string} topic - The topic to subscribe to.
   * @param {string} [meta=''] - Optional metadata associated with the subscription.
   * @returns {Promise<*>} A promise that resolves when the subscription is successful.
   */
  async subscribe(topic, meta = '') {
    return this.transport.subscribe(topic, meta)
  }

  /**
   * Unsubscribes from a given topic.
   * @param {string} topic - The topic to unsubscribe from.
   * @returns {Promise<*>} A promise that resolves when the unsubscription is successful.
   */
  async unsubscribe(topic) {
    return this.transport.unsubscribe(topic)
  }

  /**
   * Retrieves a list of subscribers to a given topic.
   * @param {string} topic - The topic to get subscribers for.
   * @param {boolean} [metadata=false] - Indicates whether to retrieve metadata associated with subscribers.
   * @returns {Promise<Array>} A promise that resolves to an array of subscribers.
   */
  async getSubscribers(topic, metadata) {
    return this.transport.getSubscribers(topic, metadata)
  }

  /**
   * Discovers peers subscribed to a topic and optionally performs actions with them.
   * @param {string} topic - The topic to discover peers on.
   * @param {boolean} [metadata=false] - Indicates whether to retrieve metadata associated with peers.
   * @param {...*} args - Additional arguments that might be required for the discovery process.
   * @returns {Promise<*>} A promise that resolves with the result of the discovery action.
   */
  async discover(topic, metadata, ...args) {
    return this.transport.discover(topic, metadata, ...args)
  }

  /**
   * Publishes data to a given topic.
   * @param {string} topic - The topic to publish the data to.
   * @param {*} payload - The payload to be published.
   * @returns {Promise<*>} A promise that resolves when the publish action is successful.
   */
  async publish(topic, payload) {
    return this.transport.publish(topic, payload)
  }

  /**
   * Broadcasts a message of a certain type with data to all subscribers of a topic.
   * @param {string} topic - The topic to broadcast the message to.
   * @param {string} type - The type of the message being broadcasted.
   * @param {*} data - The data to be broadcasted.
   * @param {Object} [opts={}] - Optional parameters for the broadcast.
   * @param {boolean} [excludeSelf=true] - Whether to exclude the sender from the list of recipients.
   * @returns {Promise<Array>} A promise that resolves to an array of responses from each recipient.
   */
  async broadcast(topic, type, data, opts, excludeSelf = true) {
    const subs = await this.getSubscribers(topic, opts)
      .then(arr => !excludeSelf ? arr : arr.filter(addr => addr !== this.addr))
    return Promise.all(subs.map(addr => {
      return this.dispatch(addr, type, data, opts)
        .then(resp => ({ addr, resp }))
    }))
  }

  // Routes
  /**
   * Example route handler for 'ping' action.
   * @param {*} data - Data received with the ping.
   * @param {string} src - The source address from which the ping originated.
   * @returns {Promise<Object>} A promise that resolves with the pong response.
   */
  // async onPing(data, src) {
  //   return 'pong'
  // }
}

module.exports = Newk
