const { _, log } = require('basd')
const TransportDecorator = require('../core/decorator')

class EncryptionDecorator extends TransportDecorator {
  constructor(transport, opts) {
    super(transport, opts)
  }
}

module.exports = EncryptionDecorator
