![Newk radioactive phone](docs/newk.png "Newk")

# Newk

> Weapon of Mass Decentralization

[![npm](https://img.shields.io/npm/v/newk?style=flat&logo=npm)](https://www.npmjs.com/package/newk)
[![pipeline](https://gitlab.com/basedwon/newk/badges/master/pipeline.svg)](https://gitlab.com/basedwon/newk/-/pipelines)
[![license](https://img.shields.io/npm/l/newk)](https://gitlab.com/basedwon/newk/-/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dw/newk)](https://www.npmjs.com/package/newk) 

[![Gitlab](https://img.shields.io/badge/Gitlab%20-%20?logo=gitlab&color=%23383a40)](https://gitlab.com/basedwon/newk)
[![Github](https://img.shields.io/badge/Github%20-%20?logo=github&color=%23383a40)](https://github.com/basedwon/newk)
[![Twitter](https://img.shields.io/badge/@basdwon%20-%20?logo=twitter&color=%23383a40)](https://twitter.com/basdwon)
[![Discord](https://img.shields.io/badge/Basedwon%20-%20?logo=discord&color=%23383a40)](https://discordapp.com/users/basedwon)

A JS library that provides a flexible, transport-layer abstraction for various network protocols. By utilizing a base transport class, `newk` allows for easy extension and customization of network communication patterns. It comes with an NKN (New Kind of Network) transport implementation and supports message routing, publish/subscribe patterns, and basic message handling.

## Features

- Transport-layer abstraction with a base class for easy extension.
- Built-in NKN transport implementation for decentralized communication.
- Support for Pub/Sub mechanisms.
- Extendable with various decorators for additional functionality.
- Straightforward message routing.

## Installation

```bash
npm install newk
```

## Usage

Import the `Newk` class mixin from the package:

```js
import Newk from 'newk'
```
or
```js
const Newk = require('newk')
```

To use `newk`, you need to create an instance of the main `Newk` class and specify the transport method.

```javascript
const { Newk } = require('newk')

const newkInstance = new Newk({
  identifier: 'your-unique-identifier',
  transport: 'nkn', // or other supported transport
  // ...other options
})

newkInstance.isReady()
  .then(() => {
    console.log('Newk instance is ready to use.')
    // Your code here
  })
```

### Sending Messages

```javascript
newkInstance.send(destinationAddress, payload)
  .then(response => {
    console.log('Message sent successfully:', response)
  })
  .catch(error => {
    console.error('Failed to send message:', error)
  })
```

### Publish/Subscribe

```javascript
// Subscribe to a topic
newkInstance.subscribe('someTopic').then(() => {
  console.log('Subscribed to topic')
})

// Publish to a topic
newkInstance.publish('someTopic', 'your message')
  .then(() => {
    console.log('Message published to the topic')
  })
```

### Custom Transports

To create a custom transport, extend the `BaseTransport` class:

```javascript
const { BaseTransport } = require('newk')

class MyTransport extends BaseTransport {
  // Implement required methods
}
```

## Documentation

- [API Reference](/docs/api.md)

### API

- `BaseTransport`: Abstract base class for all transports.
- `NknTransport`: NKN transport implementation.
- `Newk`: Main class to interact with the transport layer.

## Tests

In order to run the test suite, simply clone the repository and install its dependencies:

```bash
git clone https://gitlab.com/basedwon/newk.git
cd newk
npm install
```

To run the tests:

```bash
npm test
```

## Contributing

Thank you! Please see our [contributing guidelines](/docs/contributing.md) for details.

## Donations

If you find this project useful and want to help support further development, please send us some coin. We greatly appreciate any and all contributions. Thank you!

**Bitcoin (BTC):**
```
1JUb1yNFH6wjGekRUW6Dfgyg4J4h6wKKdF
```

**Monero (XMR):**
```
46uV2fMZT3EWkBrGUgszJCcbqFqEvqrB4bZBJwsbx7yA8e2WBakXzJSUK8aqT4GoqERzbg4oKT2SiPeCgjzVH6VpSQ5y7KQ
```

## License

Newk is [MIT licensed](https://gitlab.com/basedwon/newk/-/blob/master/LICENSE).

---


















## Usage

Here is a quick start to how you can use Newk:

```javascript
const Newk = require('newk');

// Initialize with options
const options = {
  identifier: 'your-identifier',
  transport: 'bus', // or 'nkn'
  decorators: ['pubsub', 'encryption'],
  // ... other options
};

Newk.init(options)
  .then((newkInstance) => {
    // Your newk instance is ready to be used
    // Add routes, send messages, etc.
  })
  .catch((error) => {
    console.error('Initialization failed:', error);
  });
```

## API Reference

### `Newk.init(options)`

Initializes a new Newk instance with the provided options. Returns a promise that resolves with the newk instance once it is ready.

### `newkInstance.send(destination, payload, options)`

Sends a message to the specified destination. Returns a promise with the send operation result.

### `newkInstance.dispatch(destination, type, data, options)`

Dispatches a message of a particular type to the destination. The message is encoded before sending and decoded upon receiving.

### `newkInstance.subscribe(topic, metadata)`

Subscribes to a given topic. Optionally, metadata can be provided for the subscription.

### `newkInstance.publish(topic, payload)`

Publishes a message to a given topic.

### `newkInstance.broadcast(topic, type, data, options, excludeSelf)`

Broadcasts a message of a particular type to all subscribers of a topic, with the option to exclude the sender.

## Examples

```javascript
// Subscribe to a topic
newkInstance.subscribe('news', { tag: 'tech' })
  .then(() => {
    console.log('Subscribed to tech news');
  });

// Publish a message
newkInstance.publish('news', 'Hello, this is the latest tech news!')
  .then(() => {
    console.log('Message published');
  });
```











## Usage

### Initialization

To start using `newk`, you must first create an instance of the `Newk` class and initialize it:

```js
import Newk from 'newk'

const newkInstance = Newk.init('your-identifier', { transport: 'nkn' })
newkInstance.then(newk => {
  console.log('Newk is ready!', newk.addr)
})
```

### Sending Messages

```js
const dest = 'destination-identifier'
const message = { type: 'greeting', content: 'Hello, World!' }

newkInstance.send(dest, message).then(response => {
  console.log('Message sent!', response)
})
```

### Pub/Sub

```js
// Subscribe to a topic
newkInstance.subscribe('news').then(() => {
  console.log('Subscribed to news')
})

// Publish a message to a topic
newkInstance.publish('news', 'Breaking News!').then(() => {
  console.log('Message published to news')
})
```

### Custom Routes

```js
// Add custom route
newkInstance.addRoute('echo', (data, src) => {
  console.log('Echo data:', data)
  return data // Echo back the data
})
```

### Decorators

Decorators can be used to enhance the `Newk` instance with additional functionalities:

```js
const opts = {
  decorators: ['encryption', 'seeder']
}

const newkWithDecorators = Newk.init('your-identifier', opts)
```

## API Reference

Please refer to the following methods available on a `Newk` instance:

- `isReady()`: Check if the instance is ready.
- `addRoute(action, handler)`: Add a custom route.
- `send(dest, payload, opts)`: Send a message to the specified destination.
- `subscribe(topic, meta)`: Subscribe to a topic.
- `unsubscribe(topic)`: Unsubscribe from a topic.
- `publish(topic, payload)`: Publish a message to a topic.
- `broadcast(topic, type, data, opts)`: Broadcast a message to subscribers of a topic.

## NknConnect

`NknConnect` is a utility class provided to handle connections through nkn-multi-client. You generally won't interact with this class directly unless you need to work with nkn-multi-client features directly.






















## Usage

Here's a quick overview of how to use `newk` in your application:

### Initializing Newk

```javascript
const newk = await Newk.init(options, transportType)
```

### Adding Routes

```javascript
newk.addRoute('action', handlerFunction)
newk.addRoutes(anObjectContainingMethods)
```

### Sending and Dispatching Messages

```javascript
await newk.send(destination, payload, options)
await newk.dispatch(destination, messageType, data, options)
```

### Subscription and Publishing

```javascript
await newk.subscribe(topic, metadata)
await newk.unsubscribe(topic)
await newk.publish(topic, payload)
await newk.broadcast(topic, messageType, data, options, excludeSelf)
```

### Getting Subscribers

```javascript
await newk.getSubscribers(topic, metadata)
await newk.discover(topic, metadata, ...)
```

### Handling Messages

The `onMessage` method is used to handle incoming messages:

```javascript
newk.onMessage((message) => {
  // Handle the message
})
```

### Connection Handling with NknConnect

To manage connections with `NknConnect`:

```javascript
const nknConnect = await NknConnect.init(options)
```

You can use `onMessage`, `onConnect`, and `onWsError` methods to handle different connection events.

## API Reference

The API reference section would follow, detailing each method's parameters, returns, and any other relevant information. Since this is a high-level overview, refer to the source code or further documentation for in-depth details.























A powerful JS library for building decentralized applications with a focus on ease of use and flexibility. It offers a straightforward API for messaging and pub/sub patterns, wrapped with decorators for additional functionalities like encryption and seeding. The `Newk` class is the entry point, and `NknConnect` is provided for establishing connections using nkn-multi-client.


### NKN Connect

The `nkn-connect` module is a high-level wrapper designed to simplify interactions with the NKN blockchain network. It provides a seamless way to establish and manage connections, send and receive messages, and handle network events through an intuitive JavaScript API. Built upon the `nkn-sdk`, `nkn-connect` encapsulates complex networking logic into easy-to-use class methods, enabling developers to quickly integrate NKN's decentralized communication capabilities into their applications. With features such as automatic reconnection, connection event handling, and WebSocket error management, `nkn-connect` ensures robust and resilient network operations, freeing developers to focus on building out the core functionalities of their applications.

## Features

- Transport-layer abstraction with a base class for easy extension.
- Built-in NKN transport implementation for decentralized communication.
- Support for Pub/Sub mechanisms.
- Extendable with various decorators for additional functionality.
- Straightforward message routing.







# Newk - JavaScript Networking Kit

Newk is a flexible and extensible networking kit for JavaScript, which provides a suite of tools to build complex network applications. The kit is structured around transports, decorators, and a core routing mechanism that allows developers to handle networking protocols, message passing, and various patterns such as publish/subscribe and request/response.

## Features

- **Transport Layer Abstractions**: Newk abstracts the transport layer with a variety of implementations like `BusTransport` and `NknTransport`, enabling seamless communication across different network layers.
- **Decorator Pattern**: Extend the functionality of your transports with decorators like `PubSubDecorator`, `EntryDecorator`, `SeederDecorator`, and `EncryptionDecorator`.
- **Flexible Routing**: Use the built-in `Router` class to manage incoming and outgoing messages based on the action types.
- **Message Encoding/Decoding**: Utilize `msgpack` encoding to efficiently serialize and deserialize message payloads.
- **Subscription Management**: Methods to subscribe and unsubscribe to topics, as well as publish and broadcast messages to subscribers.
- **Plug-and-Play**: Designed to be easily instantiated and utilized with minimal setup, using `Newk.init()` to create a ready-to-use instance.





## Features

- **Transport Layer Abstraction**: Easily switch between transport layers for messaging.
- **Decorator Pattern**: Extend functionality using decorators for pub/sub, encryption, and more.
- **Router Support**: Includes a router for dispatching messages to handlers based on action types.
- **Promise-based API**: All async operations return promises for easy chaining and use with async/await.
- **Pub/Sub Mechanism**: Subscribe to topics and publish messages with ease.
- **Plug & Play**: Intended to work with minimal configuration and easy initialization.



# newk

`newk` is a flexible transport and decorator-based networking toolkit for Node.js applications, providing a scalable foundation for building custom network protocols and data handling layers. It's built around a core set of classes that can be composed and extended to fit the needs of various networking scenarios.

## Features

- **Modular Transport Layer**: Use built-in transport mechanisms or plug in custom ones.
- **Decorator Pattern**: Extend functionality through decorators for pub/sub mechanisms, encryption, and more.
- **Routing**: Flexible routing capabilities to manage message paths.
- **Subscription Mechanism**: Methods to subscribe and unsubscribe to topics with metadata support.
- **Message Dispatching**: Send and dispatch messages with automatic encoding and decoding.
- **Connection Handling**: Establish connections with built-in error and state management.


