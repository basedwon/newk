const { _, log } = require('basd')
const { DISCOVERY_DELAY } = require('../core/const')

/**
 * Base class for creating transport layer implementations.
 * It defines common interface and logic for transports.
 * This class is abstract and cannot be instantiated directly.
 */
class BaseTransport {
  /**
   * Retrieves the transport type.
   * Should be overridden by subclasses to return a specific type.
   * @static
   * @returns {string|null} The transport type.
   */
  static get type() { return null }

  /**
   * BaseTransport constructor that sets up transport with provided options.
   * @param {Object} opts - The transport options.
   * @throws Will throw an error if directly instantiated or if no type is provided.
   */
  constructor(opts = {}) {
    if (new.target === BaseTransport)
      throw new TypeError('Cannot instantiate abstract BaseTransport class directly')
    if (opts instanceof BaseTransport) return opts
    _.objProp(this, 'opts', opts)
    _.objProp(this, 'type', this.constructor.type)
    if (!this.type)
      throw new Error(`Transport adapter requires a type`)
    if (_.isFunction(opts.onMessage))
      this.onMessage(opts.onMessage)
    _.objProp(this, '_ready', this.connect())
  }

  /**
   * Initiates the connection process.
   * @returns {Promise<void>}
   */
  async connect() {
    await this._connect()
  }

  /**
   * Abstract method to establish connection.
   * Should be implemented by subclasses.
   * @abstract
   * @returns {Promise<void>}
   */
  async _connect() {
  }

  /**
   * Checks if the transport is ready to send/receive messages.
   * @returns {Promise<void>}
   */
  async isReady() {
    await this._ready
  }

  /**
   * Sends a payload to the specified destination.
   * @param {string} dest - The destination address.
   * @param {*} payload - The payload to send.
   * @param {Object} [opts] - Options for sending the message.
   * @returns {Promise<*>} - The result from the send operation.
   */
  async send(dest, payload, opts) {
    await this.isReady()
    return this._send(dest, payload, opts)
  }

  /**
   * Abstract method to send the payload. Should be implemented by subclasses.
   * @abstract
   * @param {string} dest - The destination address.
   * @param {*} payload - The payload to send.
   * @param {Object} [opts] - Options for sending the message.
   * @returns {Promise<*>} - The result from the send operation.
   */
  async _send(dest, payload, opts) {
    throw new Error(`Not implemented`)
  }

  /**
   * Processes received requests.
   * @param {Object} request - The incoming request object.
   * @returns {Promise<*>} - The response to the received request.
   */
  async receive(request) {
    return this._handler(request)
  }

  /**
   * Abstract method for handling received messages.
   * Can be overridden by subclasses to provide custom handling logic.
   * @abstract
   * @param {Object} request - The request object to handle.
   * @returns {Promise<*>} - The response to the handled request.
   */
  async _handler(request) {
    log('default message handler', request)
    return 'pong'
  }

  /**
   * Sets a message handler for incoming messages.
   * @param {Function} handler - A callback to handle incoming messages.
   */
  onMessage(handler) {
    _.objProp(this, '_handler', handler, { writable: true })
  }

  // PubSub
  /**
   * Subscribes to a topic to listen for messages.
   * @abstract
   * @param {string} topic - The topic to subscribe to.
   * @param {string} [meta] - Metadata associated with the subscription.
   * @returns {Promise<void>}
   */
  async subscribe(topic, meta = '') {
    throw new Error(`Must implement subscribe() method`)
  }

  /**
   * Unsubscribes from a topic.
   * @abstract
   * @param {string} topic - The topic to unsubscribe from.
   * @returns {Promise<void>}
   */
  async unsubscribe(topic) {
    throw new Error(`Must implement unsubscribe() method`)
  }

  /**
   * Retrieves a list of subscribers to a topic.
   * @abstract
   * @param {string} topic - The topic to get subscribers for.
   * @param {Object} [opts] - Options to customize the retrieval.
   * @returns {Promise<Array>} - A promise that resolves to a list of subscribers.
   */
  async getSubscribers(topic, opts = {}) {
    throw new Error(`Must implement getSubscribers() method`)
  }

  /**
   * Discovers subscribers for a topic until at least one is found or a condition is met.
   * @param {string} topic - The topic to discover subscribers for.
   * @param {Object} [opts] - Discovery options.
   * @returns {Promise<Array>} - A promise that resolves to the list of subscribers.
   */
  async discover(topic, opts = {}) {
    const delay = opts?.delay || DISCOVERY_DELAY
    let subs = await this.getSubscribers(topic, opts)
    while (_.isEmpty(subs)) {
      await _.sleep(delay)
      subs = await this.getSubscribers(topic, opts)
    }
    return subs
  }

  /**
   * Publishes a payload to all subscribers of a topic.
   * @param {string} topic - The topic to publish to.
   * @param {*} payload - The payload to publish.
   * @returns {Promise<Array>} - A promise that resolves to the list of results from each subscriber.
   */
  async publish(topic, payload) {
    const subs = await this.getSubscribers(topic)
    return Promise.all(subs.map(addr => this.send(addr, payload).then(resp => ({ addr, resp }))))
  }
}

module.exports = BaseTransport
