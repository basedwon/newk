const { _, log } = require('basd')
const Crypto = require('crpdo')
const Mnemonic = require('crpdo/mnemonic')
const nkn = require('nkn-sdk')

const SEED_LENGTH = 8

/**
 * Seeder class responsible for generating and testing NKN client seeds.
 */
class Seeder {
  /**
   * Gets the default number of clients to test per seed.
   * @returns {number}
   */
  static get numClients() { return 4 }

  /**
   * Gets the default number of seeds to generate.
   * @returns {number}
   */
  static get numSeeds() { return 4 }

  /**
   * Gets the default number of words for mnemonic seed phrases.
   * @returns {number}
   */
  static get numWords() { return 12 }

  /**
   * Gets the default timeout for connecting to NKN clients.
   * @returns {number}
   */
  static get connectTimeout() { return 4000 }

  /**
   * Constructs a new Seeder instance with options.
   * @param {Object} opts - Options for seed generation and testing.
   */
  constructor(opts = {}) {
    this.numSeeds = opts.numSeeds || Seeder.numSeeds
    this.numWords = opts.numWords || Seeder.numWords
    this.connectTimeout = opts.connectTimeout || Seeder.connectTimeout
  }

  /**
   * Generates seeds, tests them, and returns the best candidate along with related data.
   * @param {Buffer|string} preimg - Pre-image for entropy generation.
   * @param {number} numWords - The number of words for the mnemonic phrase.
   * @returns {Promise<Object>} - The best seed and associated data.
   */
  static async generate(preimg, numWords) {
    const seeder = new this({ numWords })
    let seeds = await seeder.getSeeds(5, preimg)
    let arr = await seeder.testSeeds(seeds, 1)
    arr = arr.filter(o => !!o.goodn)
    if (arr.length < 4) {
      seeds = await seeder.getSeeds(10, preimg)
      arr = await seeder.testSeeds(seeds, 1)
      arr = arr.filter(o => !!o.goodn)
    }
    arr = await seeder.testSeeds(seeds, 10)
    const winner = arr[0]
    const addrs = arr.reduce((acc, cur) => acc.concat(_.keys(cur.good)), [])
    return { winner, arr, addrs }
  }

  /**
   * Generates a specified number of seeds.
   * @param {number} [num] - Number of seeds to generate.
   * @param {Buffer|string} preimg - Pre-image for entropy generation.
   * @returns {Promise<Array<SeedInfo>>} - An array of seed information objects.
   */
  async getSeeds(num, preimg) {
    num = num || this.numSeeds
    let seeds = []
    const bytes = Mnemonic.getByteLength(this.numWords)
    let entropy = await Crypto.getEntropy(preimg, bytes)
    for (let ii = 0; ii < num; ii++) {
      entropy = Crypto.hash(entropy, bytes, false)
      seeds.push(this.createSeed(entropy))
    }
    return Promise.all(seeds)
  }

  /**
   * Creates a seed object from given entropy.
   * @param {Buffer} entropy - The entropy to generate seed from.
   * @returns {Promise<SeedInfo>} - The generated seed information.
   */
  async createSeed(entropy) {
    const phrase = Mnemonic.entropyToMnemonic(entropy)
    const seed = await Mnemonic.mnemonicToSeed(phrase)
    let [id, hex] = Crypto.hkdf(seed, null, 2)
    id = _.encode(_.decode(id).slice(0, SEED_LENGTH))
    hex = _.decode(hex).toString('hex')
    return { entropy, phrase, seed, id, hex }
  }

  /**
   * Tests a list of seeds with NKN clients to determine their connectivity quality.
   * @param {Array<SeedInfo>} seeds - An array of seed information objects to test.
   * @param {number} [numClients] - Number of clients to test per seed.
   * @returns {Promise<Array>} - Sorted array of nodes with their test results.
   */
  async testSeeds(seeds, numClients = Seeder.numClients) {
    let arr = []
    let store = {}
    for (let ii = 0; ii < seeds.length; ii++)
      arr.push(this.testClient(seeds[ii], store, numClients))
    arr = await Promise.all(arr)
    let nodes = []
    for (let id in store) {
      let item = store[id]
      let { obj, good, bad } = item
      for (let key of ['good', 'bad']) {
        let total = 0
        for (let addr in item[key]) {
          let index = item[key][addr]
          index = +index.replace(/_/g, '')
          let invert = numClients - index
          total += invert
        }
        item[`${key}n`] = total
      }
      nodes.push(item)
    }
    return nodes.sort((a, b) => {
      if (a.goodn > b.goodn) return -1
      else if (a.goodn < b.goodn) return 1
      else if (a.badn > b.badn) return 1
      else if (a.badn < b.badn) return -1
      return 0
    })
  }

  /**
   * Tests connectivity for a single NKN client based on seed information.
   * @param {SeedInfo} obj - The seed information for the client to test.
   * @param {Object} [store] - A storage object to accumulate test results.
   * @param {number} [numSubClients] - Number of subclients to use for testing.
   * @returns {Promise<Array>} - The result of the connectivity test for the client.
   */
  async testClient(obj, store = {}, numSubClients = Seeder.numClients) {
    const opts = {
      identifier: obj.id,
      seed: obj.hex,
      numSubClients,
    }
    let item = store[obj.id]
    if (!item)
      item = { good: {}, bad: {}, obj }
    store[obj.id] = item
    // const item = store[obj.id] = { good: {}, bad: {}, obj }
    const client = new nkn.MultiClient(opts)
    // client.onConnect((node) => log('CONNECTED!'))
    // client.onConnectFailed(() => log('FAILED!'))
    client.onConnectFailed(() => {})
    client.onWsError(() => {})
    let arr = []
    for (let prefix in client.clients) {
      let node = client.clients[prefix]
      arr.push(new Promise(resolve => {
        let finished = false
        let timer = setTimeout(() => {
          // log('timed out')
          finished = true
          resolve(false)
        }, this.connectTimeout)
        node.onConnectFailed(err => {
          // log('connect failed')
        })
        node.onWsError(event => {
          const addr = event.target.url.replace(/^wss:\/\//, '').replace(/30004/, 30005)
          // log('ws error', addr)
          item.bad[addr] = prefix
          delete item.good[addr]
          if (finished) return
          clearTimeout(timer)
          resolve(false)
        })
        node.onConnect(({ node: { rpcAddr }}) => {
          if (finished) {
            log('connected but slow')
            return
          }
          // log('connected', rpcAddr)
          clearTimeout(timer)
          item.good[rpcAddr] = prefix
          resolve(rpcAddr)
        })
      }))
    }
    arr = await Promise.all(arr)
    await client.close()
    return arr
  }
}

module.exports = Seeder
