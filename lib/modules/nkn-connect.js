const { _, log } = require('basd')
const nkn = require('nkn-sdk')


/**
 * This class abstracts and encapsulates the logic required for establishing
 * and maintaining a persistent connection with the NKN network, dealing with
 * message reception, connection readiness, and WebSocket errors.
 */
class NknConnect {
  static suppressLogs() {
    // suppress some unnecessary logs (imo)
    const originalWarn = console.warn.bind(console)
    console.warn = function(msg) {
      if (!msg.includes('WebSocket unexpectedly closed.')) {
        log('sup dawg')
        originalWarn(msg)
      } else {
        log('debug', 'WebSocket closed')
      }
    }

    const originalLog = console.log.bind(console)
    console.log = function (msg) {
      const regex = /^Reconnecting in \d+(\.\d+)?s\.\.\.$/
      if (regex.test(msg)) {
        return log('debug', 'WebSocket reconnecting..')
      } else if (arguments.length >= 2 && arguments[0] === 'RPC call failed,') {
        return log('debug', 'RPC call failed')
      } else if (_.isObj(msg) && msg.Desc === 'WRONG NODE TO CONNECT') {
        return log('debug', 'NKN node failed to connect')
      }
      originalLog.apply(console, arguments)
    }
  }

  /**
   * Creates an instance of NknConnect.
   * @param {Object} [opts] - Options for NKN client creation.
   */
  constructor(opts = {}) {
    this.opts = {
      numSubClients: opts.numSubClients || 6,
      connectTimeout: opts.connectTimeout || 1200,
      threshold: 0.8,
      suppressLogs: false,
      ...opts,
    }
    this.client = null
    this.isReady = false
    this.messageHandlers = []
    this.connectHandlers = []
    this.wsErrorHandlers = []
    if (this.opts.suppressLogs)
      NknConnect.suppressLogs()
  }

  /**
   * Registers a message handler callback to be called when a message is received.
   * @param {Function} fn - The callback function to handle messages.
   */
  onMessage(fn) {
    if (this.client) {
      this.client.onMessage(fn)
    } else {
      this.messageHandlers.push(fn)
    }
  }

  /**
   * Registers a connect handler callback to be called when the client is ready.
   * @param {Function} fn - The callback function to handle connection readiness.
   */
  onConnect(fn) {
    if (this.client && this.client.isReady) {
      fn()
    } else {
      this.connectHandlers.push(fn)
    }
  }

  /**
   * Registers a WebSocket error handler callback to be called on a WebSocket error.
   * @param {Function} fn - The callback function to handle WebSocket errors.
   */
  onWsError(fn) {
    if (this.client) {
      this.client.onWsError(fn)
    } else {
      this.wsErrorHandlers.push(fn)
    }
  }

  /**
   * Initializes a new NKN client and returns it.
   * @static
   * @param {...any} args - Arguments to pass to the constructor.
   * @returns {Promise<nkn.Client>} The initialized NKN client.
   */
  static init(...args) {
    const obj = new this(...args)
    return obj.init().then(() => obj.client)
  }

  /**
   * Initializes the NKN client and sets up the message and error handlers.
   * @returns {Promise<nkn.Client>} The initialized NKN client.
   */
  async init() {
    this.client = await this.connect()
    this.messageHandlers.forEach(fn => this.client.onMessage(fn))
    this.wsErrorHandlers.forEach(fn => this.client.onWsError(fn))
    if (this.client.isReady) {
      this.connectHandlers.forEach(fn => fn())
    } else {
      this.client.onConnect(node => {
        this.connectHandlers.forEach(fn => fn(node))
      })
    }
    return this.client
  }

  /**
   * Attempts to connect to the NKN network and create a client.
   * @returns {Promise<nkn.Client>} The connected NKN client.
   */
  async connect() {
    return new Promise((resolve, reject) => {
      const nodes = []
      if (this.opts.onNodes) {
        let connected = false
        const callback = (node, nodes) => {
          const ratio = nodes.length / this.opts.numSubClients
          if (ratio >= this.opts.threshold && !connected) {
            connected = true
            return this.opts.onNodes(nodes)
          }
        }
        this.opts.onNode = _.toArr(this.opts.onNode || [])
        this.opts.onNode.push(callback)
      }
      const client = new nkn.MultiClient(this.opts)
      client.onWsError(() => {})
      client.onConnectFailed(() => {
        this.opts.numSubClients += 4
        resolve(this.connect())
      })
      let arr = []
      for (const prefix in client.clients) {
        const node = client.clients[prefix]
        arr.push(this.handleNode(node, nodes))
      }
      return Promise.all(arr).then(arr => {
        if (!client.isReady)
          return client.onConnect(data => resolve(client))
        resolve(client)
      })
    })
  }

  /**
   * Handles the node connection and returns a promise that resolves with the node upon success.
   * @param {nkn.Node} node - The node to handle.
   * @returns {Promise<nkn.Node|boolean>} The connected node or false if the connection failed.
   */
  handleNode(node, nodes = []) {
    return new Promise((done) => {
      let finished = false
      const timer = setTimeout(() => {
        finished = true
        done(false)
      }, this.opts.connectTimeout)
      node.onConnectFailed(err => {
        if (finished) return
        clearTimeout(timer)
        done(false)
      })
      node.onConnect(({ node }) => {
        if (finished) {
          nodes.push(node)
          if (this.opts.onNode)
            for (const cb of _.toArr(this.opts.onNode))
              cb(node, nodes)
          return
        }
        clearTimeout(timer)
        done(node)
      })
    })
  }
}

module.exports = NknConnect
