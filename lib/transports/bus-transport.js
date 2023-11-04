const { _, log } = require('basd')
const Crypto = require('crpdo')
const BaseTransport = require('../core/transport')

class BusTransport extends BaseTransport {
  /**
   * Returns the type of the transport which is 'bus' for this class.
   * @static
   * @returns {string} The transport type.
   */
  static get type() { return 'bus' }

  /**
   * Establishes a local bus transport connection by generating a public-private key pair,
   * constructing a unique address using the identifier and public key, and registering
   * the instance in a shared bus property on the class.
   * @returns {Promise<void>}
   */
  async _connect() {
    const key = Crypto.nacl.createSignKey(this.opts.seed)
    _.objProp(this, 'key', key)
    this.addr = [this.opts.identifier, _.decode(key.publicKey).toString('hex')].join('.')
    _.set(this.constructor, ['bus', this.addr], this)
  }

  /**
   * Sends a payload to the destination address on the bus. It locates the node
   * associated with the destination address and invokes its receive method.
   * @param {string} dest - The destination address on the bus.
   * @param {*} payload - The payload to send.
   * @returns {Promise<*>} - The result from invoking the receive method on the destination node.
   */
  async _send(dest, payload) {
    const node = _.get(this.constructor, ['bus', dest])
    if (!node) throw new Error(`Node with address "${dest}" could not be found`)
    return node.receive({ payload, src: this.addr })
  }

  // PubSub
  /**
   * Subscribes to a given topic within the bus transport layer by setting metadata
   * associated with the subscription in a shared 'pub' property on the class.
   * @param {string} topic - The topic to subscribe to.
   * @param {string} [meta=''] - Metadata associated with the subscription.
   * @returns {Promise<void>}
   */
  async subscribe(topic, meta = '') {
    _.setWith(this.constructor, ['pub', topic, this.addr], meta, Object)
  }

  /**
   * Unsubscribes from a given topic within the bus transport layer by removing
   * the address and associated metadata from the shared 'pub' property on the class.
   * @param {string} topic - The topic to unsubscribe from.
   * @returns {Promise<void>}
   */
  async unsubscribe(topic) {
    _.unset(this.constructor, ['pub', topic, this.addr])
  }

  /**
   * Retrieves a list of subscribers for a given topic. If the meta flag is true,
   * it returns the full metadata for subscribers; otherwise, it returns just their addresses.
   * @param {string} topic - The topic for which to get the subscribers.
   * @param {boolean} [meta=false] - Whether to include metadata in the return value.
   * @returns {Promise<Array|Object>} - An array of subscriber addresses or an object with subscriber metadata.
   */
  async getSubscribers(topic, meta = false) {
    const obj = _.get(this.constructor, ['pub', topic], {})
    if (meta)
      return obj
    return _.keys(obj)
  }
}

module.exports = BusTransport
