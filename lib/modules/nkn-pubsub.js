const { _, log } = require('basd')
const { setOpts } = require(BASE)

/*


class PubSubDecorator extends TransportDecorator {
  constructor(transport, opts) {
    super(transport, opts)
    if (this.transport.type === 'nkn') {
      this.persist = new PubSubPersist(this.transport, opts)
      this.connect()
    }
  }
  async connect() {
    await this.isReady()
    await this.persist.start()
  }
  async subscribe(topic, metadata, num, fee, wallet, height) {
    if (this.transport.type !== 'nkn')
      return this.transport.subscribe(topic, metadata)
    wallet = this.transport.getWallet(wallet)
    return this.persist.subscribe(topic, metadata, num, fee, wallet, height)
  }
  async unsubscribe(topic) {
    if (this.transport.type !== 'nkn')
      return this.transport.unsubscribe(topic)
    return this.persist.unsubscribe(topic)
  }
  async discover(topic, opts = {}) {
    if (this.transport.type !== 'nkn')
      return this.transport.discover(topic, opts)
    return this.persist.discover(topic, opts)
  }
}


class PubSubInterface {
  constructor(opts = {}, rpc, wire) {
    if (new.target === PubSubInterface)
      throw new TypeError('Cannot instantiate abstract PubSubInterface class directly')
    if (opts instanceof PubSubInterface) return opts
    this.id = rpc.id
    _.objProp(this, 'opts', setOpts(opts))
    _.objProp(this, 'rpc', rpc)
    _.objProp(this, 'wire', wire)
    _.objProp(this, 'identifier', wire.identifier)
  }
  async start() {
  }
  subscribe(topic, handler) {
    throw new Error('Method "subscribe" must be implemented.')
  }
  unsubscribe(topic) {
    throw new Error('Method "unsubscribe" must be implemented.')
  }
  getSubscribers(topic) {
    throw new Error('Method "getSubscribers" must be implemented.')
  }
  publish(topic, payload) {
    throw new Error('Method "publish" must be implemented.')
  }
}

module.exports = PubSubInterface



const { _, log } = require('basd')
const nkn = require('nkn-sdk')
const { setOpts } = require(BASE)
const PubSubInterface = require('../../components/pubsuber/base-pubsub')

class NknPubSub extends PubSubInterface {
  constructor(opts = {}, rpc, wire) {
    super(opts = setOpts(opts, { numBlocks: 4 }), rpc, wire)
    this.numBlocks = opts.numBlocks
  }
  async start() {
    const client = await this.getClient()
    _.objProp(this, 'client', client)
  }
  getWallet(wallet) {
    wallet = wallet || this.client.wallet
    if (!wallet) {
      const seed = this.client.getSeed()
      wallet = this.client.wallet = new nkn.Wallet({ seed })
    }
    return wallet
  }
  get wallet() {
    return this.getWallet()
  }
  async getClient() {
    await this.rpc.connect()
    return this.wire.client
  }
  async subscribe(topic, metadata, num, fee = 0, wallet) {
    wallet = this.getWallet(wallet)
    return wallet.subscribe(topic, num || this.numBlocks, this.identifier, metadata, { fee })
      .then((txnHash) => {
        log('warn', `Subscribed to "${topic}" - transaction hash:`, txnHash)
      })
      .catch((error) => {
        log('error', error)
      })
  }
  async getSubscribers(topic, opts = {}) {
    if (_.isBool(opts)) opts = { meta: opts }
    opts = _.defaults(opts, {
      txPool: true,
      offset: 0,
      limit: 1000,
      meta: false
    })
    const meta = opts.meta
    opts.meta = true
    const res = await this.wallet.getSubscribers(topic, opts)
    if (!opts.meta || !opts.txPool)
      return res
    const arr = []
    for (const map of [res.subscribers, res.subscribersInTxPool])
      for (const addr in map)
        arr.push({ addr, meta: map[addr] })
    if (!meta)
      return arr.map(item => item.addr)
    return arr
  }
  async publish(topic, data, opts = {}, excludeSelf = true) {
    let subs = await this.getSubscribers(topic, opts)
    if (excludeSelf) subs = subs.filter(addr => addr !== this.addr)
    return Promise.all(subs.map(addr => this.rpc.send(addr, data, opts).then(res => ({ addr, res }))))
  }
}

module.exports = NknPubSub
*/
