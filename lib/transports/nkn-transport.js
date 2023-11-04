const { _, log } = require('basd')
const Crypto = require('crpdo')
const NknConnect = require('../modules/nkn-connect')
const BaseTransport = require('../core/transport')

const MAX_SEND_RETRIES = 3
const NUMBER_BLOCKS = 2
const DEFAULT_FEE = 0

/**
 * NknTransport class extending the BaseTransport for NKN client specifics.
 * This class represents a transport layer built on top of the NKN network.
 * NKN (New Kind of Network) is a new generation of highly resilient,
 * decentralized data transmission network.
 * @extends BaseTransport
 */
class NknTransport extends BaseTransport {
  /**
   * Returns the type of the transport which is 'NKN' for this class.
   * @static
   * @returns {string} The transport type.
   */
  static get type() { return 'nkn' }

  /**
   * Establishes a connection using the NKN client, setting up
   * the infrastructure for sending and receiving data over the NKN network.
   * It initializes cryptographic keys, sets fees, block numbers, maximum
   * retries for sending messages, and initializes the NKN client connection.
   * @returns {Promise<void>}
   */
  async _connect() {
    _.objProp(this, 'key', Crypto.nacl.createSignKey(this.opts.seed))
    const opts = {
      identifier: this.opts.identifier,
      seed: Crypto.nacl.getPrivateSeed(this.key.privateKey, 'hex'),
      // numSubClients: this.opts.numSubClients || 10, 
      // rpcServerAddr,
      // msgHoldingSeconds: 120,
      // originalClient: true,
      // responseTimeout: 5000,
    }
    _.objProp(this, 'fee', this.opts.fee || DEFAULT_FEE)
    _.objProp(this, 'numBlocks', this.opts.numBlocks || NUMBER_BLOCKS)
    _.objProp(this, 'maxRetries', this.opts.maxRetries || MAX_SEND_RETRIES)
    _.objProp(this, 'client', await NknConnect.init(opts))
    this.addr = this.client.addr
    if (!this.client.isReady)
      await new Promise(resolve => this.client.onConnect(resolve))
    this.client.onMessage(this.receive.bind(this))
  }

  /**
   * Sends a payload to the specified NKN address, with a retry mechanism.
   * It catches errors related to message timeouts and attempts to resend
   * the message up to a maximum number of retries specified by this.maxRetries.
   * @param {string} dest - The destination NKN address.
   * @param {*} payload - The payload to send.
   * @param {Object} [opts] - Options for sending the message over the NKN network.
   * @returns {Promise<*>} - The result from the send operation.
   */
  async _send(dest, payload, opts) {
    let tries = 1
    const send = () => this.client.send(dest, payload).catch(err => {
      tries++
      log('info', 'NKN send retries', { tries })
      if (tries > this.maxRetries)
        throw new Error(`Send failed after ${this.maxRetries} tries`)
      if (err.message.startsWith('failed to send with any client: Error: Message timeout'))
        return send()
      log('warn', { dest, err: err.message })
      throw err
    })
    return send()
  }

  // NKN
  /**
   * Retrieves the NKN wallet associated with the current client, or creates one
   * if it does not exist, based on the seed from the client.
   * @param {nkn.Wallet} [wallet] - An optional wallet instance.
   * @returns {nkn.Wallet} The NKN wallet associated with the client.
   */
  getWallet(wallet) {
    wallet = wallet || this.client.wallet
    if (!wallet) {
      const seed = this.client.getSeed()
      wallet = this.client.wallet = new nkn.Wallet({ seed })
    }
    return wallet
  }

  /**
   * A getter for retrieving the NKN wallet using the getWallet method.
   * @returns {nkn.Wallet} The NKN wallet associated with the client.
   */
  get wallet() {
    return this.getWallet()
  }

  // PubSub
  /**
   * Subscribes to a given topic on the NKN network using the wallet,
   * with options for metadata, block numbers, and fee. It then logs the
   * result of the subscription action.
   * @param {string} topic - The topic to subscribe to.
   * @param {*} metadata - Metadata to associate with the subscription.
   * @param {number} [num] - Number of blocks the subscription will last.
   * @param {number} [fee] - The fee for the subscription transaction.
   * @param {nkn.Wallet} [wallet] - The NKN wallet to use for the subscription.
   * @returns {Promise<void>}
   */
  async subscribe(topic, metadata, num, fee, wallet) {
    wallet = this.getWallet(wallet)
    fee = !_.isNil(fee) ? fee : !_.isNil(this.fee) ? this.fee : 0
    const identifier = this.client.identifier
    num = num || this.numBlocks
    const opts = { fee }
    return wallet.subscribe(topic, num, identifier, metadata, opts)
      .then((txnHash) => {
        log('warn', `Subscribed to "${topic}" - transaction hash:`, txnHash)
      })
      .catch((error) => {
        log('error', error)
      })
  }

  /**
   * Unsubscribes from a given topic. It first checks for the presence of the
   * client's address in the subscriber's list, then for a valid subscription,
   * and finally performs the unsubscription action.
   * @param {string} topic - The topic to unsubscribe from.
   * @returns {Promise<boolean>} - Returns true if unsubscription is successful, otherwise logs the error.
   */
  async unsubscribe(topic) {
    let subs = await this.getSubscribers(topic, false)
    if (!subs.includes(this.addr))
      return log('warn', `can't unsubscribe -- address not found`)
    const { meta, expiresAt } = await this.wallet.getSubscription(topic, this.addr)
    if (expiresAt === 0)
      return log('warn', `can't unsubscribe -- address in tx pool`)
    return this.wallet.unsubscribe(topic, this.client.identifier)
      .then(res => {
        log('warn', `unsubscribed from ${topic}`, res)
        return true
      })
      .catch(err => log('warn', 'unsub error', err.toString()))
  }

  /**
   * Retrieves a list of subscribers for a given topic. Options can specify
   * whether to include metadata, transactions in the pool, and pagination limits.
   * @param {string} topic - The topic for which to get the subscribers.
   * @param {Object} [opts] - Options specifying meta, txPool, offset, limit.
   * @returns {Promise<Array>} - An array of subscribers with optional metadata.
   */
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

  /**
   * Publishes data to a given topic on the NKN network, optionally excluding the sender.
   * It retrieves the list of subscribers and sends the data to each one, returning the results.
   * @param {string} topic - The topic on which to publish the data.
   * @param {*} data - The data to publish.
   * @param {Object} [opts] - Additional options for the publish action.
   * @param {boolean} [excludeSelf=true] - Whether to exclude the sender from the list of subscribers.
   * @returns {Promise<Array>} - An array of results of the publish action to each subscriber.
   */
  async publish(topic, data, opts = {}, excludeSelf = true) {
    let subs = await this.getSubscribers(topic, opts)
    if (excludeSelf) subs = subs.filter(addr => addr !== this.addr)
    return Promise.all(subs.map(addr => this.rpc.send(addr, data, opts).then(res => ({ addr, res }))))
  }
}

module.exports = NknTransport
