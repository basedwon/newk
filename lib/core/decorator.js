const { _, log } = require('basd')

/**
 * A decorator for transport objects that can be used to extend the functionality of
 * an existing transport object without modifying its structure.
 */
class TransportDecorator {
  /**
   * Creates an instance of TransportDecorator.
   * @param {BaseTransport} transport - The transport object to decorate.
   * @param {Object} [opts] - Additional options for the decorator.
   */
  constructor(transport, opts) {
    _.objProp(this, 'opts', opts)
    _.objProp(this, 'transport', transport, { show: true })
  }

  /**
   * Gets the address associated with the transport.
   * @returns {string} The address of the transport.
   */
  get addr() {
    return this.transport.addr
  }

  /**
   * Initiates the connection process for the underlying transport.
   * @returns {Promise<void>} A promise that resolves when the connection is established.
   */
  async connect() {
    return this.transport.connect()
  }

  /**
   * Checks if the underlying transport is ready to send/receive messages.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating readiness.
   */
  async isReady() {
    return this.transport.isReady()
  }

  /**
   * Sends a payload to the specified destination using the underlying transport.
   * @param {string} dest - The destination address.
   * @param {*} payload - The payload to send.
   * @param {Object} [opts] - Options for sending the message.
   * @returns {Promise<*>} - The result from the send operation.
   */
  async send(dest, payload, opts) {
    return this.transport.send(dest, payload, opts)
  }

  /**
   * Processes received requests through the underlying transport.
   * @param {Object} request - The incoming request object.
   * @returns {Promise<*>} - The response to the received request.
   */
  async receive(request) {
    return this.transport.receive(request)
  }

  /**
   * Sets a message handler for incoming messages on the underlying transport.
   * @param {Function} handler - A callback to handle incoming messages.
   */
  onMessage(handler) {
    this.transport.onMessage(handler)
  }

  // PubSub
  /**
   * Subscribes to a topic to listen for messages using the underlying transport.
   * @param {string} topic - The topic to subscribe to.
   * @param {string} [meta] - Metadata associated with the subscription.
   * @returns {Promise<void>} A promise that resolves when the subscription is successful.
   */
  async subscribe(topic, meta = '') {
    return this.transport.subscribe(topic, meta)
  }

  /**
   * Unsubscribes from a topic on the underlying transport.
   * @param {string} topic - The topic to unsubscribe from.
   * @returns {Promise<void>} A promise that resolves when the unsubscription is successful.
   */
  async unsubscribe(topic) {
    return this.transport.unsubscribe(topic)
  }

  /**
   * Retrieves a list of subscribers to a topic using the underlying transport.
   * @param {string} topic - The topic to get subscribers for.
   * @param {Object} [opts] - Options to customize the retrieval.
   * @returns {Promise<Array>} A promise that resolves to a list of subscribers.
   */
  async getSubscribers(topic, opts = {}) {
    return this.transport.getSubscribers(topic, opts)
  }

  /**
   * Discovers subscribers for a topic using the underlying transport.
   * @param {string} topic - The topic to discover subscribers for.
   * @param {Object} [opts] - Discovery options.
   * @returns {Promise<Array>} A promise that resolves to the list of discovered subscribers.
   */
  async discover(topic, opts = {}) {
    return this.transport.discover(topic, opts)
  }

  /**
   * Publishes a payload to all subscribers of a topic using the underlying transport.
   * @param {string} topic - The topic to publish to.
   * @param {*} payload - The payload to publish.
   * @returns {Promise<Array>} A promise that resolves to the list of results from each subscriber.
   */
  async publish(topic, payload) {
    return this.transport.publish(topic, payload)
  }
}

module.exports = TransportDecorator
