const { _, log } = require('basd')
const nkn = require('nkn-sdk')

class Entry {
  static get official() {
    return 'mainnet-rpc-node-0001.nkn.org/mainnet/api/wallet'
  }
  static protocol(addr) {
    const detect = () => _.isBrowser && window.location.protocol === 'https' ? 'https' : 'http'
    if (!addr)
      return detect()
    return addr === this.official ? 'https' : detect()
  }
  constructor(opts = {}) {
    this.fastest = null
    this.lastTest = null
    Object.defineProperty(this, 'opts', { value: _.defaults(opts, {
      testInterval: 5000,
      // testInterval: 1000 * 60 * 5, // 5min
      testTimeout: 1000,
      maxResults: 20,
      numResults: 10,
      numTest: 5,
      numTestMin: 3,
      protocol: _.isBrowser ? 'https' : 'http',
      seeds: [],
    })})
    this.seeds = _.uniq([Entry.official].concat(opts.seeds))
    _.objProp(this, 'db', opts.db || { get (key) {}, put (key, value) {}})
  }
  static boot(...args) {
    const obj = new this(...args)
    return obj.boot().then(() => obj)
  }
  async boot() {
    const [lastTest, fastest] = await Promise.all([
      this.db.get('lastTest'),
      this.db.get('fastest')
    ])
    this.lastTest = lastTest
    this.fastest = fastest
    if (this.shouldTest())
      await this.testLatency()
  }
  shouldTest() {
    return !this.fastest || !this.lastTest || Date.now() - this.lastTest >= this.opts.testInterval
  }
  createItem(addr) {
    return { addr, res: [], avg: null, good: 0, bad: 0, ratio: 0 }
  }
  setItem(item) {
    item.good = item.res.reduce((t, n) => n ? t + 1 : t, 0)
    item.bad = item.res.reduce((t, n) => !n ? t + 1 : t, 0)
    item.avg = item.good ? Math.ceil(item.res.reduce((t, n) => n ? t += n : t, 0) / item.good) : null
    item.ratio = item.good && item.bad ? item.bad / item.good : item.bad ? 1 : 0
    item.num = item.good + item.bad
    return item
  }
  sort(arr) {
    return _.sortBy(arr, ['avg', 'bad', 'ratio'])
  }
  clean(store) {
    for (const item of store)
      if (item.res.length >= this.opts.maxResults)
        item.res = item.res.slice(-1 * this.opts.numResults)
    return store
  }
  async getStore() {
    const store = await this.db.get('store') || []
    const seeds = this.seeds.map(addr => this.createItem(addr))
    return this.sort(this.clean(_.uniqBy(store.concat(seeds), 'addr')).map(this.setItem))
  }
  async testLatency() {
    const fn = item => this.getLatency(item.addr).then(latency => {
      item.res.push(latency)
      return this.setItem(item)
    })
    this.lastTest = Date.now()
    let store = await this.getStore()
    let test = store.slice()
    test = await Promise.all(test.map(item => fn(item))).then(this.sort)
    store = _.uniqBy(test.concat(store), 'addr')
    // log(store)
    this.fastest = store[0] ? store[0].addr : Entry.official
    await Promise.all([
      this.db.put('store', store),
      this.db.put('lastTest', this.lastTest),
      this.db.put('fastest', this.fastest),
    ])
  }
  async getLatency(addr) {
    const rpcServerAddr = `${Entry.protocol(addr)}://${addr}`
    let finished = false
    const begin = Date.now()
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        finished = true
        resolve(null)
      }, this.opts.testTimeout)
      nkn.rpc.getNodeState({ rpcServerAddr })
        .then(node => {
          if (finished) {
            console.log('good but slow', Date.now() - begin, addr)
            return
          }
          clearTimeout(timer)
          resolve(Date.now() - begin)
        })
        .catch(err => {
          if (finished) return
          clearTimeout(timer)
          resolve(null)
        })
    })
  }
  async add(addrs) {
    addrs = _.isArray(addrs) ? addrs : [addrs]
    this.seeds = _.uniq(this.seeds.concat(addrs))
    const store = await this.getStore()
    if (this.shouldTest())
      await this.testLatency()
    else
      await this.db.put('store', store)
  }
}

module.exports = Entry
