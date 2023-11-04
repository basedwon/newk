const { _, log } = require('basd')
const Crypto = require('crpdo')
const Newk = require('../lib/newk')
const SeederDecorator = require('../lib/decorators/seeder-decorator')
const Storage = require('@plaindb/storage')

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

_.executor(test)
















/*
// Certainly, below are a series of test cases using Mocha/Chai for the `BaseTransport` and `NknTransport` classes. Given that the code you provided is not complete (some classes, methods, and modules like `_, Crypto, NknConnect, log` are referenced but not defined), I will assume that they exist and function as expected in your environment. These tests should be placed in a test file (e.g., `transport.test.js`) in your project.

const { expect } = require('chai')
const { BaseTransport, NknTransport } = require('path-to-your-transport-classes')

describe('BaseTransport', function() {
  it('should not allow direct instantiation', function() {
    expect(() => new BaseTransport()).to.throw('Cannot instantiate abstract BaseTransport class directly')
  })

  it('should initialize with default options', async function() {
    class MockTransport extends BaseTransport {
      async _connect() {}  // override to avoid implementation details
    }

    const transport = new MockTransport()
    await transport.isReady()
    expect(transport).to.have.property('type').that.is.null
  })

  it('should throw if type is not defined in subclass', async function() {
    class MockTransport extends BaseTransport {
      async _connect() {}  // override to avoid implementation details
    }
    MockTransport.type = undefined

    expect(() => new MockTransport()).to.throw('Transport adapter requires a type')
  })

  it('should call onMessage if provided in options', async function() {
    let messageHandlerCalled = false
    const messageHandler = () => { messageHandlerCalled = true }

    class MockTransport extends BaseTransport {
      async _connect() {}  // override to avoid implementation details
    }

    new MockTransport({ onMessage: messageHandler })
    expect(messageHandlerCalled).to.be.false // Since no message has been sent, handler should not be called
  })

  // Additional tests would continue here...
})

describe('NknTransport', function() {
  it('should have a type of "nkn"', function() {
    expect(NknTransport.type).to.equal('nkn')
  })

  it('should call _connect on instantiation', async function() {
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

  it('should attempt to send a message and fail if max retries exceeded', async function() {
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
    await expect(transport.send('destination', 'payload')).to.eventually.be.rejectedWith('Send failed after 1 tries')
  })

  // Additional tests for subscribe, unsubscribe, getSubscribers, etc., would follow...
})

// You will need to substitute `'path-to-your-transport-classes'` with the actual path to the modules where your `BaseTransport` and `NknTransport` classes are defined.

// Remember to have your environment properly set up for testing with Mocha and Chai, including any mock objects or stubs required to simulate the environment in which these classes operate. Since these tests include async functions, make sure to return the promises (or use `async/await` properly) to ensure Mocha waits for the test completion before proceeding.


*/
