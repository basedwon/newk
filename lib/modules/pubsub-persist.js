const { _, log } = require('basd')
const Evented = require('basd/evented')
const Timely = require('basd/timely')
const logLevel = 'info'
const DISCOVERY_DELAY = '3s'

class PubSubPersist extends Evented {
  constructor(rpc, opts = {}) {
    super()
    this.addr = null
    _.objProp(this, 'rpc', rpc)
    _.objProp(this, 'opts', opts)
    this.beatInterval = opts.beatInterval || '5s'
    this.timer = opts.timer || new Timely()
    this.topics = {}
  }
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
  startHeart() {
    if (!this.hasTopics() || this.timer.active('subs')) {
      return
    }
    this.heartbeat()
    this.timer.setInterval('subs', this.heartbeat.bind(this), this.beatInterval)
  }
  hasTopics() {
    return !!_.keys(this.topics).length
  }
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
  async subscribe(topic, metadata = '', num, fee, wallet, height) {
    fee = !_.isNil(fee) ? fee : !_.isNil(this.rpc.fee) ? this.rpc.fee : 0
    height = height || await this.getBlockHeight()
    num = num || this.rpc.numBlocks
    let obj = this.topics[topic]
    if (!obj)
      obj = this.topics[topic] = { topic, metadata, fee, num, next: null }
    this.startHeart()
    if (obj.next && obj.next >= height) {
      log(logLevel, 'waiting for next block', height, obj.next)
    }
    this.emit('subscribe', obj)
    obj.next = height + num + 1
    const subs = await this.getSubscribers(topic, false)
    if (subs.includes(this.addr)) {
      const { expiresAt } = await this.getSubscription(topic)
      if (expiresAt === 0) // in pool
        return log(logLevel, `in pool`)
      obj.next = expiresAt
      let expiry = await this.getSubscriptionExpiry(topic)
      return log(logLevel, 'already subscribed', { topic, height, expiresAt, expiry })
    }
    log(logLevel, 'subscribing', this.client.identifier, { num, height, next: obj.next })
    try {
      await this.rpc.subscribe(topic, metadata, num, fee, wallet)
    } catch (err) {
      log('error', 'subscribe error', err)
    }
  }
  async getSubscriptionExpiry(topic, addr) {
    const { expiresAt: exp } = await this.getSubscription(topic, addr)
    if (exp) {
      const height = await this.getBlockHeight()
      const diff = exp - height
      return diff
    }
    return exp
  }
  async getSubscription(topic, addr) {
    addr = addr || this.addr
    return this.wallet.getSubscription(topic, addr)
  }
  async getSubscribers(...args) {
    return this.rpc.getSubscribers(...args)
  }
  async unsubscribe(topic) {
    let obj = this.topics[topic]
    if (!obj)
      obj = this.topics[topic] = { topic, metadata: '', fee: 0, num: this.rpc.numBlocks, next: null }
    obj.delete = true
    this.startHeart()
  }
  async discover(topic, opts = {}) {
    opts.delay = _.str2ms(opts?.delay || DISCOVERY_DELAY)
    return this.rpc.discover(topic, opts)
  }
  async getSubsPersist(topic, time, keys, limit = 1000, offset = 0) {
  }
}

module.exports = PubSubPersist
