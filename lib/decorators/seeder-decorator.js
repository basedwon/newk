const { _, log } = require('basd')
const TransportDecorator = require('../core/decorator')

class SeederDecorator extends TransportDecorator {
  constructor(transport, opts) {
    super(transport, opts)
  }
}

module.exports = SeederDecorator
