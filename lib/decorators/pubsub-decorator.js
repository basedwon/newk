const { _, log } = require('basd')
const TransportDecorator = require('../core/decorator')
const PubSubPersist = require('../modules/nkn-pubsub')

/**
 * PubSubDecorator class that extends TransportDecorator to integrate pub/sub capabilities.
 * It is designed to work with a transport layer that is compatible with the NKN network's pub/sub model.
 * It adds persistent subscription and message capabilities to the transport.
 */
class PubSubDecorator extends TransportDecorator {
  /**
   * Constructs the PubSubDecorator.
   * @param {BaseTransport} transport - The transport layer that this decorator extends.
   * @param {Object} opts - Options for the PubSubPersist and the decorator.
   */
  constructor(transport, opts) {
    super(transport, opts)
    if (this.transport.type === 'nkn') {
      this.persist = new PubSubPersist(this.transport, opts)
      this.connect()
    }
  }

  /**
   * Connects to the pub/sub service, ensuring that the underlying transport is ready
   * and starting the PubSubPersist service to handle persistent subscriptions.
   */
  async connect() {
    await this.isReady()
    await this.persist.start()
  }

  /**
   * Subscribes to a topic with optional metadata and persistence parameters.
   * If the underlying transport is NKN, it uses PubSubPersist to handle subscriptions.
   * @param {string} topic - The topic to subscribe to.
   * @param {Object} metadata - Optional metadata associated with the subscription.
   * @param {number} num - Optional parameter for the number of subscribers to find.
   * @param {number} fee - Optional subscription fee.
   * @param {Object} wallet - Optional wallet to use for the subscription fee.
   * @param {number} height - Optional blockchain height at which the subscription should be valid.
   * @returns {Promise<*>} - A promise that resolves when the subscription is complete.
   */
  async subscribe(topic, metadata, num, fee, wallet, height) {
    if (this.transport.type !== 'nkn')
      return this.transport.subscribe(topic, metadata)
    wallet = this.transport.getWallet(wallet)
    return this.persist.subscribe(topic, metadata, num, fee, wallet, height)
  }

  /**
   * Unsubscribes from a topic. Uses PubSubPersist for unsubscribing if the transport is NKN.
   * @param {string} topic - The topic to unsubscribe from.
   * @returns {Promise<*>} - A promise that resolves when the unsubscription is complete.
   */
  async unsubscribe(topic) {
    if (this.transport.type !== 'nkn')
      return this.transport.unsubscribe(topic)
    return this.persist.unsubscribe(topic)
  }

  /**
   * Discovers subscribers for a topic using either the underlying transport or PubSubPersist for NKN.
   * @param {string} topic - The topic for which to discover subscribers.
   * @param {Object} opts - Optional options for discovery.
   * @returns {Promise<Array>} - A promise that resolves to an array of discovered subscribers.
   */
  async discover(topic, opts = {}) {
    if (this.transport.type !== 'nkn')
      return this.transport.discover(topic, opts)
    return this.persist.discover(topic, opts)
  }
}

module.exports = PubSubDecorator
