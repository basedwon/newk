const { _, log } = require('basd')
const TransportDecorator = require('../core/decorator')

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

module.exports = PubSubDecorator
