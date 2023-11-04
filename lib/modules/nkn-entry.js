const { _, log } = require('basd')
const nkn = require('nkn-sdk')

/**
 * Class representing an Entry for managing NKN node latency tests.
 */
class Entry {
  /**
   * Retrieves the official NKN node address.
   * @returns {string} The official NKN node address.
   * @static
   */
  static get official() {
    return 'mainnet-rpc-node-0001.nkn.org/mainnet/api/wallet'
  }

  /**
   * Determines the protocol (http or https) to use based on the environment and address.
   * @param {string} [addr] - The address to determine the protocol for.
   * @returns {string} The determined protocol.
   * @static
   */
  static protocol(addr) {
    const detect = () => _.isBrowser && window.location.protocol === 'https' ? 'https' : 'http'
    if (!addr)
      return detect()
    return addr === this.official ? 'https' : detect()
  }

  /**
   * Entry constructor that initializes the entry with default options and database.
   * @param {Object} [opts] - The options to use for the entry.
   */
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

  /**
   * Static method to create and boot an Entry instance.
   * @param {...any} args - The arguments to pass to the constructor.
   * @returns {Promise<Entry>} The booted Entry instance.
   * @static
   */
  static boot(...args) {
    const obj = new this(...args)
    return obj.boot().then(() => obj)
  }

  /**
   * Initializes the entry by loading stored test data and testing latency if necessary.
   * @returns {Promise<void>}
   */
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

  /**
   * Determines whether a latency test should be performed based on current data and time interval.
   * @returns {boolean} A flag indicating whether a test should be conducted.
   */
  shouldTest() {
    return !this.fastest || !this.lastTest || Date.now() - this.lastTest >= this.opts.testInterval
  }

  /**
   * Creates an object representing an item for latency testing.
   * @param {string} addr - The address of the item to test.
   * @returns {Object} The item object.
   */
  createItem(addr) {
    return { addr, res: [], avg: null, good: 0, bad: 0, ratio: 0 }
  }

  /**
   * Sets and updates the properties of a test item with new results.
   * @param {Object} item - The item to update.
   * @returns {Object} The updated item object.
   */
  setItem(item) {
    item.good = item.res.reduce((t, n) => n ? t + 1 : t, 0)
    item.bad = item.res.reduce((t, n) => !n ? t + 1 : t, 0)
    item.avg = item.good ? Math.ceil(item.res.reduce((t, n) => n ? t += n : t, 0) / item.good) : null
    item.ratio = item.good && item.bad ? item.bad / item.good : item.bad ? 1 : 0
    item.num = item.good + item.bad
    return item
  }

  /**
   * Sorts an array of test items based on their average latency, bad count, and ratio.
   * @param {Array<Object>} arr - The array of items to sort.
   * @returns {Array<Object>} The sorted array of items.
   */
  sort(arr) {
    return _.sortBy(arr, ['avg', 'bad', 'ratio'])
  }

  /**
   * Cleans a store of items by limiting the number of results stored for each.
   * @param {Array<Object>} store - The store of items to clean.
   * @returns {Array<Object>} The cleaned store of items.
   */
  clean(store) {
    for (const item of store)
      if (item.res.length >= this.opts.maxResults)
        item.res = item.res.slice(-1 * this.opts.numResults)
    return store
  }

  /**
   * Retrieves the current store of latency test items, including seed addresses.
   * @returns {Promise<Array<Object>>} A promise that resolves to the store of items.
   */
  async getStore() {
    const store = await this.db.get('store') || []
    const seeds = this.seeds.map(addr => this.createItem(addr))
    return this.sort(this.clean(_.uniqBy(store.concat(seeds), 'addr')).map(this.setItem))
  }

  /**
   * Tests the latency for each item in the store and updates the store accordingly.
   * @returns {Promise<void>}
   */
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

  /**
   * Gets the latency for a given address by making an RPC call and timing the response.
   * @param {string} addr - The address to test.
   * @returns {Promise<number|null>} The latency in milliseconds or null if the request failed or timed out.
   */
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

  /**
   * Adds new addresses to the seeds list and updates the store, performing latency tests if necessary.
   * @param {string|string[]} addrs - The address or array of addresses to add.
   * @returns {Promise<void>}
   */
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
