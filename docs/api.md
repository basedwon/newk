## Classes

<dl>
<dt><a href="#TransportDecorator">TransportDecorator</a></dt>
<dd><p>A decorator for transport objects that can be used to extend the functionality of
an existing transport object without modifying its structure.</p>
</dd>
<dt><a href="#Router">Router</a></dt>
<dd><p>Router for handling route-based actions.</p>
</dd>
<dt><a href="#BaseTransport">BaseTransport</a></dt>
<dd><p>Base class for creating transport layer implementations.
It defines common interface and logic for transports.
This class is abstract and cannot be instantiated directly.</p>
</dd>
<dt><a href="#NknConnect">NknConnect</a></dt>
<dd><p>Highly persistent and fault-tolerant connection to the NKN network.</p>
</dd>
<dt><a href="#Entry">Entry</a></dt>
<dd><p>Class representing an Entry for managing NKN node latency tests.</p>
</dd>
<dt><a href="#Seeder">Seeder</a></dt>
<dd><p>Seeder class responsible for generating and testing NKN client seeds.</p>
</dd>
<dt><a href="#PubSubPersist">PubSubPersist</a></dt>
<dd><p>Represents a persistent Pub/Sub manager with extended functionality.
Inherits from the Evented class to allow for event-driven architecture.</p>
</dd>
<dt><a href="#Newk">Newk</a></dt>
<dd><p>Main class for creating a network communication instance with various transport and decorator options.</p>
</dd>
<dt><a href="#NknTransport">NknTransport</a> ⇐ <code><a href="#BaseTransport">BaseTransport</a></code></dt>
<dd><p>NknTransport class extending the BaseTransport for NKN client specifics.
This class represents a transport layer built on top of the NKN network.
NKN (New Kind of Network) is a new generation of highly resilient,
decentralized data transmission network.</p>
</dd>
</dl>

<a name="TransportDecorator"></a>

## TransportDecorator
A decorator for transport objects that can be used to extend the functionality of
an existing transport object without modifying its structure.

**Kind**: global class  

* [TransportDecorator](#TransportDecorator)
    * [new TransportDecorator(transport, [opts])](#new_TransportDecorator_new)
    * [.addr](#TransportDecorator+addr) ⇒ <code>string</code>
    * [.connect()](#TransportDecorator+connect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.isReady()](#TransportDecorator+isReady) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.send(dest, payload, [opts])](#TransportDecorator+send) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.receive(request)](#TransportDecorator+receive) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.onMessage(handler)](#TransportDecorator+onMessage)
    * [.subscribe(topic, [meta])](#TransportDecorator+subscribe) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.unsubscribe(topic)](#TransportDecorator+unsubscribe) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getSubscribers(topic, [opts])](#TransportDecorator+getSubscribers) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.discover(topic, [opts])](#TransportDecorator+discover) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.publish(topic, payload)](#TransportDecorator+publish) ⇒ <code>Promise.&lt;Array&gt;</code>

<a name="new_TransportDecorator_new"></a>

### new TransportDecorator(transport, [opts])
Creates an instance of TransportDecorator.


| Param | Type | Description |
| --- | --- | --- |
| transport | [<code>BaseTransport</code>](#BaseTransport) | The transport object to decorate. |
| [opts] | <code>Object</code> | Additional options for the decorator. |

<a name="TransportDecorator+addr"></a>

### transportDecorator.addr ⇒ <code>string</code>
Gets the address associated with the transport.

**Kind**: instance property of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>string</code> - The address of the transport.  
<a name="TransportDecorator+connect"></a>

### transportDecorator.connect() ⇒ <code>Promise.&lt;void&gt;</code>
Initiates the connection process for the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the connection is established.  
<a name="TransportDecorator+isReady"></a>

### transportDecorator.isReady() ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if the underlying transport is ready to send/receive messages.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A promise that resolves to a boolean indicating readiness.  
<a name="TransportDecorator+send"></a>

### transportDecorator.send(dest, payload, [opts]) ⇒ <code>Promise.&lt;\*&gt;</code>
Sends a payload to the specified destination using the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The result from the send operation.  

| Param | Type | Description |
| --- | --- | --- |
| dest | <code>string</code> | The destination address. |
| payload | <code>\*</code> | The payload to send. |
| [opts] | <code>Object</code> | Options for sending the message. |

<a name="TransportDecorator+receive"></a>

### transportDecorator.receive(request) ⇒ <code>Promise.&lt;\*&gt;</code>
Processes received requests through the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The response to the received request.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | The incoming request object. |

<a name="TransportDecorator+onMessage"></a>

### transportDecorator.onMessage(handler)
Sets a message handler for incoming messages on the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>function</code> | A callback to handle incoming messages. |

<a name="TransportDecorator+subscribe"></a>

### transportDecorator.subscribe(topic, [meta]) ⇒ <code>Promise.&lt;void&gt;</code>
Subscribes to a topic to listen for messages using the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the subscription is successful.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to subscribe to. |
| [meta] | <code>string</code> | Metadata associated with the subscription. |

<a name="TransportDecorator+unsubscribe"></a>

### transportDecorator.unsubscribe(topic) ⇒ <code>Promise.&lt;void&gt;</code>
Unsubscribes from a topic on the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the unsubscription is successful.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to unsubscribe from. |

<a name="TransportDecorator+getSubscribers"></a>

### transportDecorator.getSubscribers(topic, [opts]) ⇒ <code>Promise.&lt;Array&gt;</code>
Retrieves a list of subscribers to a topic using the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - A promise that resolves to a list of subscribers.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to get subscribers for. |
| [opts] | <code>Object</code> | Options to customize the retrieval. |

<a name="TransportDecorator+discover"></a>

### transportDecorator.discover(topic, [opts]) ⇒ <code>Promise.&lt;Array&gt;</code>
Discovers subscribers for a topic using the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - A promise that resolves to the list of discovered subscribers.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to discover subscribers for. |
| [opts] | <code>Object</code> | Discovery options. |

<a name="TransportDecorator+publish"></a>

### transportDecorator.publish(topic, payload) ⇒ <code>Promise.&lt;Array&gt;</code>
Publishes a payload to all subscribers of a topic using the underlying transport.

**Kind**: instance method of [<code>TransportDecorator</code>](#TransportDecorator)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - A promise that resolves to the list of results from each subscriber.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to publish to. |
| payload | <code>\*</code> | The payload to publish. |

<a name="Router"></a>

## Router
Router for handling route-based actions.

**Kind**: global class  

* [Router](#Router)
    * [new Router([opts])](#new_Router_new)
    * [.addRoute(route, handler)](#Router+addRoute)
    * [.addRoutes(obj, [pathPrefix])](#Router+addRoutes)
    * [.execute(route, ...args)](#Router+execute) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="new_Router_new"></a>

### new Router([opts])
Creates an instance of Router.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> | <code>{}</code> | The options for the router. |
| [opts.routePrefix] | <code>string</code> | <code>&quot;&#x27;on&#x27;&quot;</code> | The prefix for route handlers. |
| [opts.routes] | <code>Object</code> |  | An object containing initial routes. |
| [opts.pathPrefix] | <code>string</code> |  | A prefix to add to all route paths. |

<a name="Router+addRoute"></a>

### router.addRoute(route, handler)
Adds a single route and its handler to the router.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| route | <code>string</code> | The route path. |
| handler | <code>function</code> | The function to handle the route. |

<a name="Router+addRoutes"></a>

### router.addRoutes(obj, [pathPrefix])
Adds multiple routes from an object of methods.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object containing methods to be added as routes. |
| [pathPrefix] | <code>string</code> | Optional prefix for the route paths. |

<a name="Router+execute"></a>

### router.execute(route, ...args) ⇒ <code>Promise.&lt;\*&gt;</code>
Executes the handler associated with a given route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - The result of the route handler execution.  

| Param | Type | Description |
| --- | --- | --- |
| route | <code>string</code> | The route to execute. |
| ...args | <code>\*</code> | Arguments to pass to the route handler. |

<a name="BaseTransport"></a>

## BaseTransport
Base class for creating transport layer implementations.
It defines common interface and logic for transports.
This class is abstract and cannot be instantiated directly.

**Kind**: global class  

* [BaseTransport](#BaseTransport)
    * [new BaseTransport(opts)](#new_BaseTransport_new)
    * _instance_
        * [.connect()](#BaseTransport+connect) ⇒ <code>Promise.&lt;void&gt;</code>
        * *[._connect()](#BaseTransport+_connect) ⇒ <code>Promise.&lt;void&gt;</code>*
        * [.isReady()](#BaseTransport+isReady) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.send(dest, payload, [opts])](#BaseTransport+send) ⇒ <code>Promise.&lt;\*&gt;</code>
        * *[._send(dest, payload, [opts])](#BaseTransport+_send) ⇒ <code>Promise.&lt;\*&gt;</code>*
        * [.receive(request)](#BaseTransport+receive) ⇒ <code>Promise.&lt;\*&gt;</code>
        * *[._handler(request)](#BaseTransport+_handler) ⇒ <code>Promise.&lt;\*&gt;</code>*
        * [.onMessage(handler)](#BaseTransport+onMessage)
        * *[.subscribe(topic, [meta])](#BaseTransport+subscribe) ⇒ <code>Promise.&lt;void&gt;</code>*
        * *[.unsubscribe(topic)](#BaseTransport+unsubscribe) ⇒ <code>Promise.&lt;void&gt;</code>*
        * *[.getSubscribers(topic, [opts])](#BaseTransport+getSubscribers) ⇒ <code>Promise.&lt;Array&gt;</code>*
        * [.discover(topic, [opts])](#BaseTransport+discover) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.publish(topic, payload)](#BaseTransport+publish) ⇒ <code>Promise.&lt;Array&gt;</code>
    * _static_
        * [.type](#BaseTransport.type) ⇒ <code>string</code> \| <code>null</code>

<a name="new_BaseTransport_new"></a>

### new BaseTransport(opts)
BaseTransport constructor that sets up transport with provided options.

**Throws**:

- Will throw an error if directly instantiated or if no type is provided.


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | The transport options. |

<a name="BaseTransport+connect"></a>

### baseTransport.connect() ⇒ <code>Promise.&lt;void&gt;</code>
Initiates the connection process.

**Kind**: instance method of [<code>BaseTransport</code>](#BaseTransport)  
<a name="BaseTransport+_connect"></a>

### *baseTransport.\_connect() ⇒ <code>Promise.&lt;void&gt;</code>*
Abstract method to establish connection.
Should be implemented by subclasses.

**Kind**: instance abstract method of [<code>BaseTransport</code>](#BaseTransport)  
<a name="BaseTransport+isReady"></a>

### baseTransport.isReady() ⇒ <code>Promise.&lt;void&gt;</code>
Checks if the transport is ready to send/receive messages.

**Kind**: instance method of [<code>BaseTransport</code>](#BaseTransport)  
<a name="BaseTransport+send"></a>

### baseTransport.send(dest, payload, [opts]) ⇒ <code>Promise.&lt;\*&gt;</code>
Sends a payload to the specified destination.

**Kind**: instance method of [<code>BaseTransport</code>](#BaseTransport)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The result from the send operation.  

| Param | Type | Description |
| --- | --- | --- |
| dest | <code>string</code> | The destination address. |
| payload | <code>\*</code> | The payload to send. |
| [opts] | <code>Object</code> | Options for sending the message. |

<a name="BaseTransport+_send"></a>

### *baseTransport.\_send(dest, payload, [opts]) ⇒ <code>Promise.&lt;\*&gt;</code>*
Abstract method to send the payload. Should be implemented by subclasses.

**Kind**: instance abstract method of [<code>BaseTransport</code>](#BaseTransport)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The result from the send operation.  

| Param | Type | Description |
| --- | --- | --- |
| dest | <code>string</code> | The destination address. |
| payload | <code>\*</code> | The payload to send. |
| [opts] | <code>Object</code> | Options for sending the message. |

<a name="BaseTransport+receive"></a>

### baseTransport.receive(request) ⇒ <code>Promise.&lt;\*&gt;</code>
Processes received requests.

**Kind**: instance method of [<code>BaseTransport</code>](#BaseTransport)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The response to the received request.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | The incoming request object. |

<a name="BaseTransport+_handler"></a>

### *baseTransport.\_handler(request) ⇒ <code>Promise.&lt;\*&gt;</code>*
Abstract method for handling received messages.
Can be overridden by subclasses to provide custom handling logic.

**Kind**: instance abstract method of [<code>BaseTransport</code>](#BaseTransport)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The response to the handled request.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | The request object to handle. |

<a name="BaseTransport+onMessage"></a>

### baseTransport.onMessage(handler)
Sets a message handler for incoming messages.

**Kind**: instance method of [<code>BaseTransport</code>](#BaseTransport)  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>function</code> | A callback to handle incoming messages. |

<a name="BaseTransport+subscribe"></a>

### *baseTransport.subscribe(topic, [meta]) ⇒ <code>Promise.&lt;void&gt;</code>*
Subscribes to a topic to listen for messages.

**Kind**: instance abstract method of [<code>BaseTransport</code>](#BaseTransport)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to subscribe to. |
| [meta] | <code>string</code> | Metadata associated with the subscription. |

<a name="BaseTransport+unsubscribe"></a>

### *baseTransport.unsubscribe(topic) ⇒ <code>Promise.&lt;void&gt;</code>*
Unsubscribes from a topic.

**Kind**: instance abstract method of [<code>BaseTransport</code>](#BaseTransport)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to unsubscribe from. |

<a name="BaseTransport+getSubscribers"></a>

### *baseTransport.getSubscribers(topic, [opts]) ⇒ <code>Promise.&lt;Array&gt;</code>*
Retrieves a list of subscribers to a topic.

**Kind**: instance abstract method of [<code>BaseTransport</code>](#BaseTransport)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - A promise that resolves to a list of subscribers.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to get subscribers for. |
| [opts] | <code>Object</code> | Options to customize the retrieval. |

<a name="BaseTransport+discover"></a>

### baseTransport.discover(topic, [opts]) ⇒ <code>Promise.&lt;Array&gt;</code>
Discovers subscribers for a topic until at least one is found or a condition is met.

**Kind**: instance method of [<code>BaseTransport</code>](#BaseTransport)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - A promise that resolves to the list of subscribers.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to discover subscribers for. |
| [opts] | <code>Object</code> | Discovery options. |

<a name="BaseTransport+publish"></a>

### baseTransport.publish(topic, payload) ⇒ <code>Promise.&lt;Array&gt;</code>
Publishes a payload to all subscribers of a topic.

**Kind**: instance method of [<code>BaseTransport</code>](#BaseTransport)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - A promise that resolves to the list of results from each subscriber.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to publish to. |
| payload | <code>\*</code> | The payload to publish. |

<a name="BaseTransport.type"></a>

### BaseTransport.type ⇒ <code>string</code> \| <code>null</code>
Retrieves the transport type.
Should be overridden by subclasses to return a specific type.

**Kind**: static property of [<code>BaseTransport</code>](#BaseTransport)  
**Returns**: <code>string</code> \| <code>null</code> - The transport type.  
<a name="NknConnect"></a>

## NknConnect
Highly persistent and fault-tolerant connection to the NKN network.

**Kind**: global class  

* [NknConnect](#NknConnect)
    * [new NknConnect([opts])](#new_NknConnect_new)
    * _instance_
        * [.onMessage(fn)](#NknConnect+onMessage)
        * [.onConnect(fn)](#NknConnect+onConnect)
        * [.onWsError(fn)](#NknConnect+onWsError)
        * [.init()](#NknConnect+init) ⇒ <code>Promise.&lt;nkn.Client&gt;</code>
        * [.connect()](#NknConnect+connect) ⇒ <code>Promise.&lt;nkn.Client&gt;</code>
        * [.handleNode(node)](#NknConnect+handleNode) ⇒ <code>Promise.&lt;(nkn.Node\|boolean)&gt;</code>
    * _static_
        * [.init(...args)](#NknConnect.init) ⇒ <code>Promise.&lt;nkn.Client&gt;</code>

<a name="new_NknConnect_new"></a>

### new NknConnect([opts])
Creates an instance of NknConnect.


| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Object</code> | Options for NKN client creation. |

<a name="NknConnect+onMessage"></a>

### nknConnect.onMessage(fn)
Registers a message handler callback to be called when a message is received.

**Kind**: instance method of [<code>NknConnect</code>](#NknConnect)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The callback function to handle messages. |

<a name="NknConnect+onConnect"></a>

### nknConnect.onConnect(fn)
Registers a connect handler callback to be called when the client is ready.

**Kind**: instance method of [<code>NknConnect</code>](#NknConnect)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The callback function to handle connection readiness. |

<a name="NknConnect+onWsError"></a>

### nknConnect.onWsError(fn)
Registers a WebSocket error handler callback to be called on a WebSocket error.

**Kind**: instance method of [<code>NknConnect</code>](#NknConnect)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The callback function to handle WebSocket errors. |

<a name="NknConnect+init"></a>

### nknConnect.init() ⇒ <code>Promise.&lt;nkn.Client&gt;</code>
Initializes the NKN client and sets up the message and error handlers.

**Kind**: instance method of [<code>NknConnect</code>](#NknConnect)  
**Returns**: <code>Promise.&lt;nkn.Client&gt;</code> - The initialized NKN client.  
<a name="NknConnect+connect"></a>

### nknConnect.connect() ⇒ <code>Promise.&lt;nkn.Client&gt;</code>
Attempts to connect to the NKN network and create a client.

**Kind**: instance method of [<code>NknConnect</code>](#NknConnect)  
**Returns**: <code>Promise.&lt;nkn.Client&gt;</code> - The connected NKN client.  
<a name="NknConnect+handleNode"></a>

### nknConnect.handleNode(node) ⇒ <code>Promise.&lt;(nkn.Node\|boolean)&gt;</code>
Handles the node connection and returns a promise that resolves with the node upon success.

**Kind**: instance method of [<code>NknConnect</code>](#NknConnect)  
**Returns**: <code>Promise.&lt;(nkn.Node\|boolean)&gt;</code> - The connected node or false if the connection failed.  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>nkn.Node</code> | The node to handle. |

<a name="NknConnect.init"></a>

### NknConnect.init(...args) ⇒ <code>Promise.&lt;nkn.Client&gt;</code>
Initializes a new NKN client and returns it.

**Kind**: static method of [<code>NknConnect</code>](#NknConnect)  
**Returns**: <code>Promise.&lt;nkn.Client&gt;</code> - The initialized NKN client.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Arguments to pass to the constructor. |

<a name="Entry"></a>

## Entry
Class representing an Entry for managing NKN node latency tests.

**Kind**: global class  

* [Entry](#Entry)
    * [new Entry([opts])](#new_Entry_new)
    * _instance_
        * [.boot()](#Entry+boot) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.shouldTest()](#Entry+shouldTest) ⇒ <code>boolean</code>
        * [.createItem(addr)](#Entry+createItem) ⇒ <code>Object</code>
        * [.setItem(item)](#Entry+setItem) ⇒ <code>Object</code>
        * [.sort(arr)](#Entry+sort) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.clean(store)](#Entry+clean) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.getStore()](#Entry+getStore) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
        * [.testLatency()](#Entry+testLatency) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getLatency(addr)](#Entry+getLatency) ⇒ <code>Promise.&lt;(number\|null)&gt;</code>
        * [.add(addrs)](#Entry+add) ⇒ <code>Promise.&lt;void&gt;</code>
    * _static_
        * [.official](#Entry.official) ⇒ <code>string</code>
        * [.protocol([addr])](#Entry.protocol) ⇒ <code>string</code>
        * [.boot(...args)](#Entry.boot) ⇒ [<code>Promise.&lt;Entry&gt;</code>](#Entry)

<a name="new_Entry_new"></a>

### new Entry([opts])
Entry constructor that initializes the entry with default options and database.


| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Object</code> | The options to use for the entry. |

<a name="Entry+boot"></a>

### entry.boot() ⇒ <code>Promise.&lt;void&gt;</code>
Initializes the entry by loading stored test data and testing latency if necessary.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
<a name="Entry+shouldTest"></a>

### entry.shouldTest() ⇒ <code>boolean</code>
Determines whether a latency test should be performed based on current data and time interval.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
**Returns**: <code>boolean</code> - A flag indicating whether a test should be conducted.  
<a name="Entry+createItem"></a>

### entry.createItem(addr) ⇒ <code>Object</code>
Creates an object representing an item for latency testing.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
**Returns**: <code>Object</code> - The item object.  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> | The address of the item to test. |

<a name="Entry+setItem"></a>

### entry.setItem(item) ⇒ <code>Object</code>
Sets and updates the properties of a test item with new results.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
**Returns**: <code>Object</code> - The updated item object.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> | The item to update. |

<a name="Entry+sort"></a>

### entry.sort(arr) ⇒ <code>Array.&lt;Object&gt;</code>
Sorts an array of test items based on their average latency, bad count, and ratio.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
**Returns**: <code>Array.&lt;Object&gt;</code> - The sorted array of items.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Object&gt;</code> | The array of items to sort. |

<a name="Entry+clean"></a>

### entry.clean(store) ⇒ <code>Array.&lt;Object&gt;</code>
Cleans a store of items by limiting the number of results stored for each.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
**Returns**: <code>Array.&lt;Object&gt;</code> - The cleaned store of items.  

| Param | Type | Description |
| --- | --- | --- |
| store | <code>Array.&lt;Object&gt;</code> | The store of items to clean. |

<a name="Entry+getStore"></a>

### entry.getStore() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Retrieves the current store of latency test items, including seed addresses.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - A promise that resolves to the store of items.  
<a name="Entry+testLatency"></a>

### entry.testLatency() ⇒ <code>Promise.&lt;void&gt;</code>
Tests the latency for each item in the store and updates the store accordingly.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
<a name="Entry+getLatency"></a>

### entry.getLatency(addr) ⇒ <code>Promise.&lt;(number\|null)&gt;</code>
Gets the latency for a given address by making an RPC call and timing the response.

**Kind**: instance method of [<code>Entry</code>](#Entry)  
**Returns**: <code>Promise.&lt;(number\|null)&gt;</code> - The latency in milliseconds or null if the request failed or timed out.  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> | The address to test. |

<a name="Entry+add"></a>

### entry.add(addrs) ⇒ <code>Promise.&lt;void&gt;</code>
Adds new addresses to the seeds list and updates the store, performing latency tests if necessary.

**Kind**: instance method of [<code>Entry</code>](#Entry)  

| Param | Type | Description |
| --- | --- | --- |
| addrs | <code>string</code> \| <code>Array.&lt;string&gt;</code> | The address or array of addresses to add. |

<a name="Entry.official"></a>

### Entry.official ⇒ <code>string</code>
Retrieves the official NKN node address.

**Kind**: static property of [<code>Entry</code>](#Entry)  
**Returns**: <code>string</code> - The official NKN node address.  
<a name="Entry.protocol"></a>

### Entry.protocol([addr]) ⇒ <code>string</code>
Determines the protocol (http or https) to use based on the environment and address.

**Kind**: static method of [<code>Entry</code>](#Entry)  
**Returns**: <code>string</code> - The determined protocol.  

| Param | Type | Description |
| --- | --- | --- |
| [addr] | <code>string</code> | The address to determine the protocol for. |

<a name="Entry.boot"></a>

### Entry.boot(...args) ⇒ [<code>Promise.&lt;Entry&gt;</code>](#Entry)
Static method to create and boot an Entry instance.

**Kind**: static method of [<code>Entry</code>](#Entry)  
**Returns**: [<code>Promise.&lt;Entry&gt;</code>](#Entry) - The booted Entry instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | The arguments to pass to the constructor. |

<a name="Seeder"></a>

## Seeder
Seeder class responsible for generating and testing NKN client seeds.

**Kind**: global class  

* [Seeder](#Seeder)
    * [new Seeder(opts)](#new_Seeder_new)
    * _instance_
        * [.getSeeds([num], preimg)](#Seeder+getSeeds) ⇒ <code>Promise.&lt;Array.&lt;SeedInfo&gt;&gt;</code>
        * [.createSeed(entropy)](#Seeder+createSeed) ⇒ <code>Promise.&lt;SeedInfo&gt;</code>
        * [.testSeeds(seeds, [numClients])](#Seeder+testSeeds) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.testClient(obj, [store], [numSubClients])](#Seeder+testClient) ⇒ <code>Promise.&lt;Array&gt;</code>
    * _static_
        * [.numClients](#Seeder.numClients) ⇒ <code>number</code>
        * [.numSeeds](#Seeder.numSeeds) ⇒ <code>number</code>
        * [.numWords](#Seeder.numWords) ⇒ <code>number</code>
        * [.connectTimeout](#Seeder.connectTimeout) ⇒ <code>number</code>
        * [.generate(preimg, numWords)](#Seeder.generate) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="new_Seeder_new"></a>

### new Seeder(opts)
Constructs a new Seeder instance with options.


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | Options for seed generation and testing. |

<a name="Seeder+getSeeds"></a>

### seeder.getSeeds([num], preimg) ⇒ <code>Promise.&lt;Array.&lt;SeedInfo&gt;&gt;</code>
Generates a specified number of seeds.

**Kind**: instance method of [<code>Seeder</code>](#Seeder)  
**Returns**: <code>Promise.&lt;Array.&lt;SeedInfo&gt;&gt;</code> - - An array of seed information objects.  

| Param | Type | Description |
| --- | --- | --- |
| [num] | <code>number</code> | Number of seeds to generate. |
| preimg | <code>Buffer</code> \| <code>string</code> | Pre-image for entropy generation. |

<a name="Seeder+createSeed"></a>

### seeder.createSeed(entropy) ⇒ <code>Promise.&lt;SeedInfo&gt;</code>
Creates a seed object from given entropy.

**Kind**: instance method of [<code>Seeder</code>](#Seeder)  
**Returns**: <code>Promise.&lt;SeedInfo&gt;</code> - - The generated seed information.  

| Param | Type | Description |
| --- | --- | --- |
| entropy | <code>Buffer</code> | The entropy to generate seed from. |

<a name="Seeder+testSeeds"></a>

### seeder.testSeeds(seeds, [numClients]) ⇒ <code>Promise.&lt;Array&gt;</code>
Tests a list of seeds with NKN clients to determine their connectivity quality.

**Kind**: instance method of [<code>Seeder</code>](#Seeder)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - Sorted array of nodes with their test results.  

| Param | Type | Description |
| --- | --- | --- |
| seeds | <code>Array.&lt;SeedInfo&gt;</code> | An array of seed information objects to test. |
| [numClients] | <code>number</code> | Number of clients to test per seed. |

<a name="Seeder+testClient"></a>

### seeder.testClient(obj, [store], [numSubClients]) ⇒ <code>Promise.&lt;Array&gt;</code>
Tests connectivity for a single NKN client based on seed information.

**Kind**: instance method of [<code>Seeder</code>](#Seeder)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - The result of the connectivity test for the client.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>SeedInfo</code> | The seed information for the client to test. |
| [store] | <code>Object</code> | A storage object to accumulate test results. |
| [numSubClients] | <code>number</code> | Number of subclients to use for testing. |

<a name="Seeder.numClients"></a>

### Seeder.numClients ⇒ <code>number</code>
Gets the default number of clients to test per seed.

**Kind**: static property of [<code>Seeder</code>](#Seeder)  
<a name="Seeder.numSeeds"></a>

### Seeder.numSeeds ⇒ <code>number</code>
Gets the default number of seeds to generate.

**Kind**: static property of [<code>Seeder</code>](#Seeder)  
<a name="Seeder.numWords"></a>

### Seeder.numWords ⇒ <code>number</code>
Gets the default number of words for mnemonic seed phrases.

**Kind**: static property of [<code>Seeder</code>](#Seeder)  
<a name="Seeder.connectTimeout"></a>

### Seeder.connectTimeout ⇒ <code>number</code>
Gets the default timeout for connecting to NKN clients.

**Kind**: static property of [<code>Seeder</code>](#Seeder)  
<a name="Seeder.generate"></a>

### Seeder.generate(preimg, numWords) ⇒ <code>Promise.&lt;Object&gt;</code>
Generates seeds, tests them, and returns the best candidate along with related data.

**Kind**: static method of [<code>Seeder</code>](#Seeder)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - The best seed and associated data.  

| Param | Type | Description |
| --- | --- | --- |
| preimg | <code>Buffer</code> \| <code>string</code> | Pre-image for entropy generation. |
| numWords | <code>number</code> | The number of words for the mnemonic phrase. |

<a name="PubSubPersist"></a>

## PubSubPersist
Represents a persistent Pub/Sub manager with extended functionality.
Inherits from the Evented class to allow for event-driven architecture.

**Kind**: global class  

* [PubSubPersist](#PubSubPersist)
    * [new PubSubPersist(rpc, [opts])](#new_PubSubPersist_new)
    * [.start()](#PubSubPersist+start) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.startHeart()](#PubSubPersist+startHeart)
    * [.hasTopics()](#PubSubPersist+hasTopics) ⇒ <code>boolean</code>
    * [.heartbeat()](#PubSubPersist+heartbeat) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getBlockHeight()](#PubSubPersist+getBlockHeight) ⇒ <code>Promise.&lt;(number\|boolean)&gt;</code>
    * [.subscribe(topic, [metadata], [num], [fee], [wallet], [height])](#PubSubPersist+subscribe) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getSubscriptionExpiry(topic, [addr])](#PubSubPersist+getSubscriptionExpiry) ⇒ <code>Promise.&lt;number&gt;</code>
    * [.getSubscription(topic, [addr])](#PubSubPersist+getSubscription) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getSubscribers(...args)](#PubSubPersist+getSubscribers) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.unsubscribe(topic)](#PubSubPersist+unsubscribe) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.discover(topic, [opts])](#PubSubPersist+discover) ⇒ <code>Promise.&lt;Array&gt;</code>

<a name="new_PubSubPersist_new"></a>

### new PubSubPersist(rpc, [opts])
Creates an instance of PubSubPersist.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rpc | <code>Object</code> |  | An object that provides RPC functionalities. |
| [opts] | <code>Object</code> | <code>{}</code> | Options for the PubSubPersist. |

<a name="PubSubPersist+start"></a>

### pubSubPersist.start() ⇒ <code>Promise.&lt;void&gt;</code>
Starts the Pub/Sub system and subscribes to the provided topics.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  
<a name="PubSubPersist+startHeart"></a>

### pubSubPersist.startHeart()
Initiates the heartbeat mechanism for keeping the subscriptions alive.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  
<a name="PubSubPersist+hasTopics"></a>

### pubSubPersist.hasTopics() ⇒ <code>boolean</code>
Checks if there are any active topics.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  
<a name="PubSubPersist+heartbeat"></a>

### pubSubPersist.heartbeat() ⇒ <code>Promise.&lt;void&gt;</code>
Performs a heartbeat action to renew subscriptions and manage topic list.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  
<a name="PubSubPersist+getBlockHeight"></a>

### pubSubPersist.getBlockHeight() ⇒ <code>Promise.&lt;(number\|boolean)&gt;</code>
Retrieves the current block height from the blockchain.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  
<a name="PubSubPersist+subscribe"></a>

### pubSubPersist.subscribe(topic, [metadata], [num], [fee], [wallet], [height]) ⇒ <code>Promise.&lt;void&gt;</code>
Subscribes to a topic with optional metadata, block count, and fee.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| topic | <code>string</code> |  | The topic to subscribe to. |
| [metadata] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Metadata related to the subscription. |
| [num] | <code>number</code> |  | The number of blocks the subscription should be valid. |
| [fee] | <code>number</code> |  | The subscription fee. |
| [wallet] | <code>Object</code> |  | The wallet object to perform transactions. |
| [height] | <code>number</code> |  | The current block height, if already known. |

<a name="PubSubPersist+getSubscriptionExpiry"></a>

### pubSubPersist.getSubscriptionExpiry(topic, [addr]) ⇒ <code>Promise.&lt;number&gt;</code>
Determines the number of blocks until a subscription expires.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic of the subscription. |
| [addr] | <code>string</code> | The address to check the subscription for. Defaults to own address. |

<a name="PubSubPersist+getSubscription"></a>

### pubSubPersist.getSubscription(topic, [addr]) ⇒ <code>Promise.&lt;Object&gt;</code>
Gets the details of a subscription for a topic.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to get the subscription for. |
| [addr] | <code>string</code> | The address of the subscriber. |

<a name="PubSubPersist+getSubscribers"></a>

### pubSubPersist.getSubscribers(...args) ⇒ <code>Promise.&lt;Array&gt;</code>
Retrieves a list of subscribers for a given topic.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Arguments to be passed for subscriber retrieval. |

<a name="PubSubPersist+unsubscribe"></a>

### pubSubPersist.unsubscribe(topic) ⇒ <code>Promise.&lt;void&gt;</code>
Marks a topic for unsubscription during the next heartbeat cycle.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to unsubscribe from. |

<a name="PubSubPersist+discover"></a>

### pubSubPersist.discover(topic, [opts]) ⇒ <code>Promise.&lt;Array&gt;</code>
Discovers subscribers for a given topic, with a delay if necessary.

**Kind**: instance method of [<code>PubSubPersist</code>](#PubSubPersist)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| topic | <code>string</code> |  | The topic to discover subscribers for. |
| [opts] | <code>Object</code> | <code>{}</code> | Options for the discovery process. |

<a name="Newk"></a>

## Newk
Main class for creating a network communication instance with various transport and decorator options.

**Kind**: global class  

* [Newk](#Newk)
    * [new Newk(opts, [transport])](#new_Newk_new)
    * _instance_
        * [.addr](#Newk+addr) ⇒ <code>string</code>
        * [.isReady()](#Newk+isReady) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.addRoute(action, handler)](#Newk+addRoute) ⇒ <code>\*</code>
        * [.addRoutes(obj, [path])](#Newk+addRoutes) ⇒ <code>\*</code>
        * [.send(dest, payload, [opts])](#Newk+send) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.dispatch(dest, type, data, [opts])](#Newk+dispatch) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.receive(param)](#Newk+receive) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.onMessage(handler)](#Newk+onMessage)
        * [.subscribe(topic, [meta])](#Newk+subscribe) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.unsubscribe(topic)](#Newk+unsubscribe) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.getSubscribers(topic, [metadata])](#Newk+getSubscribers) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.discover(topic, [metadata], ...args)](#Newk+discover) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.publish(topic, payload)](#Newk+publish) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.broadcast(topic, type, data, [opts], [excludeSelf])](#Newk+broadcast) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.onPing(data, src)](#Newk+onPing) ⇒ <code>Promise.&lt;Object&gt;</code>
    * _static_
        * [.classes](#Newk.classes) ⇒ <code>Object</code>
        * [.init(...args)](#Newk.init) ⇒ [<code>Promise.&lt;Newk&gt;</code>](#Newk)

<a name="new_Newk_new"></a>

### new Newk(opts, [transport])
Initializes a new Newk instance with options and transport.


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> \| <code>string</code> | Options for the instance or the identifier. |
| [transport] | <code>Object</code> | Transport configuration or instance. |

<a name="Newk+addr"></a>

### newk.addr ⇒ <code>string</code>
Gets the address associated with the transport layer.

**Kind**: instance property of [<code>Newk</code>](#Newk)  
**Returns**: <code>string</code> - The address of the transport.  
<a name="Newk+isReady"></a>

### newk.isReady() ⇒ <code>Promise.&lt;void&gt;</code>
Checks if the transport layer is ready.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the transport is ready.  
<a name="Newk+addRoute"></a>

### newk.addRoute(action, handler) ⇒ <code>\*</code>
Adds a route to the router.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>\*</code> - The result of the route addition.  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | The action that the route corresponds to. |
| handler | <code>function</code> | The handler function for the route. |

<a name="Newk+addRoutes"></a>

### newk.addRoutes(obj, [path]) ⇒ <code>\*</code>
Adds multiple routes from an object with handlers.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>\*</code> - The result of adding the routes.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object containing methods that represent routes. |
| [path] | <code>string</code> | An optional path prefix for the routes. |

<a name="Newk+send"></a>

### newk.send(dest, payload, [opts]) ⇒ <code>Promise.&lt;\*&gt;</code>
Sends a message to the specified destination.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves with the response from the destination.  

| Param | Type | Description |
| --- | --- | --- |
| dest | <code>string</code> \| <code>Object</code> | The destination address or object with address. |
| payload | <code>\*</code> | The payload to send. |
| [opts] | <code>Object</code> | Optional parameters for sending the message. |

<a name="Newk+dispatch"></a>

### newk.dispatch(dest, type, data, [opts]) ⇒ <code>Promise.&lt;\*&gt;</code>
Dispatches a typed message to a specific destination.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves with the decoded response.  

| Param | Type | Description |
| --- | --- | --- |
| dest | <code>string</code> | The destination address. |
| type | <code>string</code> | The type of the message to dispatch. |
| data | <code>\*</code> | The data to include in the message. |
| [opts] | <code>Object</code> | Optional parameters for the dispatch. |

<a name="Newk+receive"></a>

### newk.receive(param) ⇒ <code>Promise.&lt;\*&gt;</code>
Handles incoming messages.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves with the encoded response.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> | An object containing the payload and source. |

<a name="Newk+onMessage"></a>

### newk.onMessage(handler)
Registers a message handler.

**Kind**: instance method of [<code>Newk</code>](#Newk)  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>function</code> | The function to handle incoming messages. |

<a name="Newk+subscribe"></a>

### newk.subscribe(topic, [meta]) ⇒ <code>Promise.&lt;\*&gt;</code>
Subscribes to a given topic.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves when the subscription is successful.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| topic | <code>string</code> |  | The topic to subscribe to. |
| [meta] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Optional metadata associated with the subscription. |

<a name="Newk+unsubscribe"></a>

### newk.unsubscribe(topic) ⇒ <code>Promise.&lt;\*&gt;</code>
Unsubscribes from a given topic.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves when the unsubscription is successful.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to unsubscribe from. |

<a name="Newk+getSubscribers"></a>

### newk.getSubscribers(topic, [metadata]) ⇒ <code>Promise.&lt;Array&gt;</code>
Retrieves a list of subscribers to a given topic.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - A promise that resolves to an array of subscribers.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| topic | <code>string</code> |  | The topic to get subscribers for. |
| [metadata] | <code>boolean</code> | <code>false</code> | Indicates whether to retrieve metadata associated with subscribers. |

<a name="Newk+discover"></a>

### newk.discover(topic, [metadata], ...args) ⇒ <code>Promise.&lt;\*&gt;</code>
Discovers peers subscribed to a topic and optionally performs actions with them.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves with the result of the discovery action.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| topic | <code>string</code> |  | The topic to discover peers on. |
| [metadata] | <code>boolean</code> | <code>false</code> | Indicates whether to retrieve metadata associated with peers. |
| ...args | <code>\*</code> |  | Additional arguments that might be required for the discovery process. |

<a name="Newk+publish"></a>

### newk.publish(topic, payload) ⇒ <code>Promise.&lt;\*&gt;</code>
Publishes data to a given topic.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves when the publish action is successful.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to publish the data to. |
| payload | <code>\*</code> | The payload to be published. |

<a name="Newk+broadcast"></a>

### newk.broadcast(topic, type, data, [opts], [excludeSelf]) ⇒ <code>Promise.&lt;Array&gt;</code>
Broadcasts a message of a certain type with data to all subscribers of a topic.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - A promise that resolves to an array of responses from each recipient.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| topic | <code>string</code> |  | The topic to broadcast the message to. |
| type | <code>string</code> |  | The type of the message being broadcasted. |
| data | <code>\*</code> |  | The data to be broadcasted. |
| [opts] | <code>Object</code> | <code>{}</code> | Optional parameters for the broadcast. |
| [excludeSelf] | <code>boolean</code> | <code>true</code> | Whether to exclude the sender from the list of recipients. |

<a name="Newk+onPing"></a>

### newk.onPing(data, src) ⇒ <code>Promise.&lt;Object&gt;</code>
Example route handler for 'ping' action.

**Kind**: instance method of [<code>Newk</code>](#Newk)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves with the pong response.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Data received with the ping. |
| src | <code>string</code> | The source address from which the ping originated. |

<a name="Newk.classes"></a>

### Newk.classes ⇒ <code>Object</code>
Retrieves the available classes for transports and decorators.

**Kind**: static property of [<code>Newk</code>](#Newk)  
**Returns**: <code>Object</code> - An object containing transport and decorator class mappings.  
<a name="Newk.init"></a>

### Newk.init(...args) ⇒ [<code>Promise.&lt;Newk&gt;</code>](#Newk)
Initializes and returns a Newk instance after ensuring it is ready.

**Kind**: static method of [<code>Newk</code>](#Newk)  
**Returns**: [<code>Promise.&lt;Newk&gt;</code>](#Newk) - A promise that resolves to the ready Newk instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | Arguments to pass to the constructor. |

<a name="NknTransport"></a>

## NknTransport ⇐ [<code>BaseTransport</code>](#BaseTransport)
NknTransport class extending the BaseTransport for NKN client specifics.
This class represents a transport layer built on top of the NKN network.
NKN (New Kind of Network) is a new generation of highly resilient,
decentralized data transmission network.

**Kind**: global class  
**Extends**: [<code>BaseTransport</code>](#BaseTransport)  

* [NknTransport](#NknTransport) ⇐ [<code>BaseTransport</code>](#BaseTransport)
    * _instance_
        * [.wallet](#NknTransport+wallet) ⇒ <code>nkn.Wallet</code>
        * [._connect()](#NknTransport+_connect) ⇒ <code>Promise.&lt;void&gt;</code>
        * [._send(dest, payload, [opts])](#NknTransport+_send) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.getWallet([wallet])](#NknTransport+getWallet) ⇒ <code>nkn.Wallet</code>
        * [.subscribe(topic, metadata, [num], [fee], [wallet])](#NknTransport+subscribe) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.unsubscribe(topic)](#NknTransport+unsubscribe) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.getSubscribers(topic, [opts])](#NknTransport+getSubscribers) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.publish(topic, data, [opts], [excludeSelf])](#NknTransport+publish) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.connect()](#BaseTransport+connect) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.isReady()](#BaseTransport+isReady) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.send(dest, payload, [opts])](#BaseTransport+send) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.receive(request)](#BaseTransport+receive) ⇒ <code>Promise.&lt;\*&gt;</code>
        * *[._handler(request)](#BaseTransport+_handler) ⇒ <code>Promise.&lt;\*&gt;</code>*
        * [.onMessage(handler)](#BaseTransport+onMessage)
        * [.discover(topic, [opts])](#BaseTransport+discover) ⇒ <code>Promise.&lt;Array&gt;</code>
    * _static_
        * [.type](#NknTransport.type) ⇒ <code>string</code>

<a name="NknTransport+wallet"></a>

### nknTransport.wallet ⇒ <code>nkn.Wallet</code>
A getter for retrieving the NKN wallet using the getWallet method.

**Kind**: instance property of [<code>NknTransport</code>](#NknTransport)  
**Returns**: <code>nkn.Wallet</code> - The NKN wallet associated with the client.  
<a name="NknTransport+_connect"></a>

### nknTransport.\_connect() ⇒ <code>Promise.&lt;void&gt;</code>
Establishes a connection using the NKN client, setting up
the infrastructure for sending and receiving data over the NKN network.
It initializes cryptographic keys, sets fees, block numbers, maximum
retries for sending messages, and initializes the NKN client connection.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Overrides**: [<code>\_connect</code>](#BaseTransport+_connect)  
<a name="NknTransport+_send"></a>

### nknTransport.\_send(dest, payload, [opts]) ⇒ <code>Promise.&lt;\*&gt;</code>
Sends a payload to the specified NKN address, with a retry mechanism.
It catches errors related to message timeouts and attempts to resend
the message up to a maximum number of retries specified by this.maxRetries.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Overrides**: [<code>\_send</code>](#BaseTransport+_send)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The result from the send operation.  

| Param | Type | Description |
| --- | --- | --- |
| dest | <code>string</code> | The destination NKN address. |
| payload | <code>\*</code> | The payload to send. |
| [opts] | <code>Object</code> | Options for sending the message over the NKN network. |

<a name="NknTransport+getWallet"></a>

### nknTransport.getWallet([wallet]) ⇒ <code>nkn.Wallet</code>
Retrieves the NKN wallet associated with the current client, or creates one
if it does not exist, based on the seed from the client.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Returns**: <code>nkn.Wallet</code> - The NKN wallet associated with the client.  

| Param | Type | Description |
| --- | --- | --- |
| [wallet] | <code>nkn.Wallet</code> | An optional wallet instance. |

<a name="NknTransport+subscribe"></a>

### nknTransport.subscribe(topic, metadata, [num], [fee], [wallet]) ⇒ <code>Promise.&lt;void&gt;</code>
Subscribes to a given topic on the NKN network using the wallet,
with options for metadata, block numbers, and fee. It then logs the
result of the subscription action.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Overrides**: [<code>subscribe</code>](#BaseTransport+subscribe)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to subscribe to. |
| metadata | <code>\*</code> | Metadata to associate with the subscription. |
| [num] | <code>number</code> | Number of blocks the subscription will last. |
| [fee] | <code>number</code> | The fee for the subscription transaction. |
| [wallet] | <code>nkn.Wallet</code> | The NKN wallet to use for the subscription. |

<a name="NknTransport+unsubscribe"></a>

### nknTransport.unsubscribe(topic) ⇒ <code>Promise.&lt;boolean&gt;</code>
Unsubscribes from a given topic. It first checks for the presence of the
client's address in the subscriber's list, then for a valid subscription,
and finally performs the unsubscription action.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Overrides**: [<code>unsubscribe</code>](#BaseTransport+unsubscribe)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - Returns true if unsubscription is successful, otherwise logs the error.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to unsubscribe from. |

<a name="NknTransport+getSubscribers"></a>

### nknTransport.getSubscribers(topic, [opts]) ⇒ <code>Promise.&lt;Array&gt;</code>
Retrieves a list of subscribers for a given topic. Options can specify
whether to include metadata, transactions in the pool, and pagination limits.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Overrides**: [<code>getSubscribers</code>](#BaseTransport+getSubscribers)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - An array of subscribers with optional metadata.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic for which to get the subscribers. |
| [opts] | <code>Object</code> | Options specifying meta, txPool, offset, limit. |

<a name="NknTransport+publish"></a>

### nknTransport.publish(topic, data, [opts], [excludeSelf]) ⇒ <code>Promise.&lt;Array&gt;</code>
Publishes data to a given topic on the NKN network, optionally excluding the sender.
It retrieves the list of subscribers and sends the data to each one, returning the results.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Overrides**: [<code>publish</code>](#BaseTransport+publish)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - An array of results of the publish action to each subscriber.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| topic | <code>string</code> |  | The topic on which to publish the data. |
| data | <code>\*</code> |  | The data to publish. |
| [opts] | <code>Object</code> |  | Additional options for the publish action. |
| [excludeSelf] | <code>boolean</code> | <code>true</code> | Whether to exclude the sender from the list of subscribers. |

<a name="BaseTransport+connect"></a>

### nknTransport.connect() ⇒ <code>Promise.&lt;void&gt;</code>
Initiates the connection process.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
<a name="BaseTransport+isReady"></a>

### nknTransport.isReady() ⇒ <code>Promise.&lt;void&gt;</code>
Checks if the transport is ready to send/receive messages.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
<a name="BaseTransport+send"></a>

### nknTransport.send(dest, payload, [opts]) ⇒ <code>Promise.&lt;\*&gt;</code>
Sends a payload to the specified destination.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The result from the send operation.  

| Param | Type | Description |
| --- | --- | --- |
| dest | <code>string</code> | The destination address. |
| payload | <code>\*</code> | The payload to send. |
| [opts] | <code>Object</code> | Options for sending the message. |

<a name="BaseTransport+receive"></a>

### nknTransport.receive(request) ⇒ <code>Promise.&lt;\*&gt;</code>
Processes received requests.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The response to the received request.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | The incoming request object. |

<a name="BaseTransport+_handler"></a>

### *nknTransport.\_handler(request) ⇒ <code>Promise.&lt;\*&gt;</code>*
Abstract method for handling received messages.
Can be overridden by subclasses to provide custom handling logic.

**Kind**: instance abstract method of [<code>NknTransport</code>](#NknTransport)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - The response to the handled request.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | The request object to handle. |

<a name="BaseTransport+onMessage"></a>

### nknTransport.onMessage(handler)
Sets a message handler for incoming messages.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>function</code> | A callback to handle incoming messages. |

<a name="BaseTransport+discover"></a>

### nknTransport.discover(topic, [opts]) ⇒ <code>Promise.&lt;Array&gt;</code>
Discovers subscribers for a topic until at least one is found or a condition is met.

**Kind**: instance method of [<code>NknTransport</code>](#NknTransport)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - A promise that resolves to the list of subscribers.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic to discover subscribers for. |
| [opts] | <code>Object</code> | Discovery options. |

<a name="NknTransport.type"></a>

### NknTransport.type ⇒ <code>string</code>
Returns the type of the transport which is 'NKN' for this class.

**Kind**: static property of [<code>NknTransport</code>](#NknTransport)  
**Returns**: <code>string</code> - The transport type.  
