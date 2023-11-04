const { _, log } = require('basd')
const TransportDecorator = require('../core/decorator')

class EntryDecorator extends TransportDecorator {
  constructor(transport, opts) {
    super(transport, opts)
  }
}

module.exports = EntryDecorator
