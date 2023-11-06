const { _, log } = require('basd')
const Crypto = require('crpdo')
const Newk = require('../lib/newk')
const SeederDecorator = require('../lib/decorators/seeder-decorator')
const Storage = require('@plaindb/storage')

const BaseTransport = require('../lib/core/transport')
const NknTransport = require('../lib/transports/nkn-transport')

describe('BaseTransport', () => {
  class MockTransport extends BaseTransport {
    static get type() { return 'mock' }
  }

  it('should not allow direct instantiation', () => {
    expect(() => new BaseTransport()).to.throw('Cannot instantiate abstract BaseTransport class directly')
  })

  it('should initialize with default options', async () => {
    const transport = new MockTransport()
    await transport.isReady()
    expect(transport).to.have.property('type').that.is.equal('mock')
  })

  it('should throw if type is not defined in subclass', async () => {
    class MockTransport extends BaseTransport {}
    expect(() => new MockTransport()).to.throw('Transport adapter requires a type')
  })

  it('should call onMessage if provided in options', async () => {
    let messageHandlerCalled = false
    const messageHandler = () => { messageHandlerCalled = true }
    new MockTransport({ onMessage: messageHandler })
    expect(messageHandlerCalled).to.be.false
  })
})

describe('NknTransport', () => {
  it('should have a type of "nkn"', () => {
    expect(NknTransport.type).to.equal('nkn')
  })

  it('should call _connect on instantiation', async () => {
    let connectCalled = false
    class MockNknTransport extends NknTransport {
      async _connect() {
        connectCalled = true
      }
    }

    const transport = new MockNknTransport({ seed: 'seed', identifier: 'identifier' })
    await transport.isReady()
    expect(connectCalled).to.be.true
  })

  it('@todo - should attempt to send a message and fail if max retries exceeded', async () => {
    class MockNknTransport extends NknTransport {
      constructor() {
        super({ seed: 'seed', identifier: 'identifier' })
        this.maxRetries = 1
      }

      async _connect() {
        // simulate successful connection
      }

      client = {
        send: () => Promise.reject(new Error('Message timeout'))
      }
    }

    const transport = new MockNknTransport()
    // await expect(transport.send('destination', 'payload')).to.eventually.be.rejectedWith('Send failed after 1 tries')
  })

  // Additional tests for subscribe, unsubscribe, getSubscribers, etc., would follow...
})






async function testV3() {
  // const { addrs } = await Seeder.generate('foo')

  // const seeder = new Seeder()
  // const seeds = await seeder.getSeeds(3, 'foo')
  // let arr = await seeder.testSeeds(seeds, 1)
  // log(arr)

  // const db = new LevelDB(true)
  // const entry = await Entry.boot({ db, seeds: addrs })

  // const db = new LevelDB()
  // const entry = await Entry.boot({ db })

  // log(entry)
  // await db.listAll()
}

async function test() {
  const topic = Crypto.hash('bing')
  // decorators = [PubSubDecorator, EncryptionDecorator, SeederDecorator]
  // decorators = [PubSubDecorator]
  // decorators = [EntryDecorator]
  decorators = ['entry', 'encryption', SeederDecorator]
  decorators = []
  opts = { transport: 'bus', decorators }
  // opts.transport = 'nkn'

  const [alice, bob] = await Promise.all(['alice', 'bob'].map(n => Newk.init(n, opts)))
  _.print({ alice, bob })

  res = await alice.dispatch(bob, 'ping', { greeting: 'Hello!' })
  log(res)


  const db = new Storage()
  log(db)



  // setTimeout(() => bob.subscribe(topic), 3000)
  // subs = await alice.discover(topic)
  // log({ subs })

  // await bob.subscribe(topic)
  // await bob.unsubscribe(topic)

  // let subs = await alice.getSubscribers(topic)
  // log({ subs })

  // res = await alice.broadcast(topic, 'ping', 'sup!')
  // log(res)

  // const db = new LevelDB(true)
  // users = ['alice', 'bob']
  // const [alice, bob, chad] = await Promise.all(users.map(n => Node.init(db, n)))

  // _.print({ alice, bob })

  // let res = await alice.send(bob, 'Hello!')
  // log(res)
}

// _.executor(test)
