const { _, log } = require('basd')
const Evented = require('basd/evented')
const Timely = require('basd/timely')
const { DISCOVERY_DELAY, LOG_LEVEL } = require('../core/const')

/**
 * Represents a persistent Pub/Sub manager with extended functionality.
 * Inherits from the Evented class to allow for event-driven architecture.
 */
class PubSubPersist extends Evented {
  /**
   * Creates an instance of PubSubPersist.
   * @param {Object} rpc - An object that provides RPC functionalities.
   * @param {Object} [opts={}] - Options for the PubSubPersist.
   */
  constructor(rpc, opts = {}) {
    super()
    this.addr = null
    _.objProp(this, 'rpc', rpc)
    _.objProp(this, 'opts', opts)
    this.beatInterval = opts.beatInterval || '5s'
    this.timer = opts.timer || new Timely()
    this.topics = {}
  }

  /**
   * Starts the Pub/Sub system and subscribes to the provided topics.
   * @returns {Promise<void>}
   */
  async start() {
    this.addr = this.rpc.addr
    _.objProp(this, 'client', this.rpc.client)
    _.objProp(this, 'wallet', this.rpc.wallet)
    if (this.opts.topics) {
      if (_.isArray(this.opts.topics)) {
        for (const topic of this.opts.topics) {
          await this.subscribe(topic)
        }
      } else if (_.isObj(this.opts.topics)) {
        for (const [topic, metadata] of _.entries(this.opts.topics)) {
          await this.subscribe(topic, metadata)
        }
      }
    }
    this.startHeart()
  }

  /**
   * Initiates the heartbeat mechanism for keeping the subscriptions alive.
   */
  startHeart() {
    if (!this.hasTopics() || this.timer.active('subs')) {
      return
    }
    this.heartbeat()
    this.timer.setInterval('subs', this.heartbeat.bind(this), this.beatInterval)
  }

  /**
   * Checks if there are any active topics.
   * @returns {boolean}
   */
  hasTopics() {
    return !!_.keys(this.topics).length
  }

  /**
   * Performs a heartbeat action to renew subscriptions and manage topic list.
   * @returns {Promise<void>}
   */
  async heartbeat() {
    if (!this.hasTopics()) {
      log('warn', `removing all subs`)
      this.timer.clear('subs')
      return
    }
    const height = await this.getBlockHeight()
    log('warn', 'beat::', height)
    for (const topic in this.topics) {
      const obj = this.topics[topic]
      if (obj.delete) {
        const res = await this.rpc.unsubscribe(topic)
        if (res)
          delete this.topics[topic]
        continue
      }
      try {
        await this.subscribe(topic, obj.metadata, obj.num, obj.fee, this.wallet, height)
      } catch (err) {
        log('error', 'heartbeat subscribe error:', err.toString())
      }
    }
  }

  /**
   * Retrieves the current block height from the blockchain.
   * @returns {Promise<number|boolean>}
   */
  async getBlockHeight() {
    try {
      const block = await this.wallet.getLatestBlock()
      if (!block)
        return false
      const { height: num } = block
      return num
    } catch (err) {
      log('warn', 'block height error:', err.toString())
    }
  }

  /**
   * Subscribes to a topic with optional metadata, block count, and fee.
   * @param {string} topic - The topic to subscribe to.
   * @param {string} [metadata=''] - Metadata related to the subscription.
   * @param {number} [num] - The number of blocks the subscription should be valid.
   * @param {number} [fee] - The subscription fee.
   * @param {Object} [wallet] - The wallet object to perform transactions.
   * @param {number} [height] - The current block height, if already known.
   * @returns {Promise<void>}
   */
  async subscribe(topic, metadata = '', num, fee, wallet, height) {
    fee = !_.isNil(fee) ? fee : !_.isNil(this.rpc.fee) ? this.rpc.fee : 0
    height = height || await this.getBlockHeight()
    num = num || this.rpc.numBlocks
    let obj = this.topics[topic]
    if (!obj)
      obj = this.topics[topic] = { topic, metadata, fee, num, next: null }
    this.startHeart()
    if (obj.next && obj.next >= height) {
      log(LOG_LEVEL, 'waiting for next block', height, obj.next)
    }
    this.emit('subscribe', obj)
    obj.next = height + num + 1
    const subs = await this.getSubscribers(topic, false)
    if (subs.includes(this.addr)) {
      const { expiresAt } = await this.getSubscription(topic)
      if (expiresAt === 0) // in pool
        return log(LOG_LEVEL, `in pool`)
      obj.next = expiresAt
      let expiry = await this.getSubscriptionExpiry(topic)
      return log(LOG_LEVEL, 'already subscribed', { topic, height, expiresAt, expiry })
    }
    log(LOG_LEVEL, 'subscribing', this.client.identifier, { num, height, next: obj.next })
    try {
      await this.rpc.subscribe(topic, metadata, num, fee, wallet)
    } catch (err) {
      log('error', 'subscribe error', err)
    }
  }

  /**
   * Determines the number of blocks until a subscription expires.
   * @param {string} topic - The topic of the subscription.
   * @param {string} [addr] - The address to check the subscription for. Defaults to own address.
   * @returns {Promise<number>}
   */
  async getSubscriptionExpiry(topic, addr) {
    const { expiresAt: exp } = await this.getSubscription(topic, addr)
    if (exp) {
      const height = await this.getBlockHeight()
      const diff = exp - height
      return diff
    }
    return exp
  }

  /**
   * Gets the details of a subscription for a topic.
   * @param {string} topic - The topic to get the subscription for.
   * @param {string} [addr] - The address of the subscriber.
   * @returns {Promise<Object>}
   */
  async getSubscription(topic, addr) {
    addr = addr || this.addr
    return this.wallet.getSubscription(topic, addr)
  }

  /**
   * Retrieves a list of subscribers for a given topic.
   * @param {...any} args - Arguments to be passed for subscriber retrieval.
   * @returns {Promise<Array>}
   */
  async getSubscribers(...args) {
    return this.rpc.getSubscribers(...args)
  }

  /**
   * Marks a topic for unsubscription during the next heartbeat cycle.
   * @param {string} topic - The topic to unsubscribe from.
   * @returns {Promise<void>}
   */
  async unsubscribe(topic) {
    let obj = this.topics[topic]
    if (!obj)
      obj = this.topics[topic] = { topic, metadata: '', fee: 0, num: this.rpc.numBlocks, next: null }
    obj.delete = true
    this.startHeart()
  }

  /**
   * Discovers subscribers for a given topic, with a delay if necessary.
   * @param {string} topic - The topic to discover subscribers for.
   * @param {Object} [opts={}] - Options for the discovery process.
   * @returns {Promise<Array>}
   */
  async discover(topic, opts = {}) {
    opts.delay = _.str2ms(opts?.delay || DISCOVERY_DELAY)
    return this.rpc.discover(topic, opts)
  }
}

module.exports = PubSubPersist
