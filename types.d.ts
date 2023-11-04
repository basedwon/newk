declare module 'newk' {
  type TransportOptions = {
    onMessage?: (message: any) => void;
    [key: string]: any;
  };

  type SubscriberInfo = {
    addr: string;
    meta?: string;
  };

  type DispatchResponse = {
    addr: string;
    resp: any;
  };

  type Payload = {
    payload: any;
    src: string;
  };

  type SubscribeOptions = {
    delay?: number;
    [key: string]: any;
  };

  type SendMessageOptions = {
    [key: string]: any;
  };

  abstract class BaseTransport {
    static type: string | null;
    opts: TransportOptions;
    type: string;
    protected _ready: Promise<void>;

    constructor(opts?: TransportOptions);

    connect(): Promise<void>;
    protected abstract _connect(): Promise<void>;
    isReady(): Promise<void>;
    send(dest: string, payload: any, opts?: SendMessageOptions): Promise<any>;
    protected abstract _send(dest: string, payload: any, opts?: SendMessageOptions): Promise<any>;
    receive(request: any): Promise<any>;
    protected _handler(request: any): Promise<any>;
    onMessage(handler: (message: any) => void): void;
    abstract subscribe(topic: string, meta?: string): Promise<void>;
    abstract unsubscribe(topic: string): Promise<void>;
    getSubscribers(topic: string, opts?: SubscribeOptions): Promise<SubscriberInfo[]>;
    discover(topic: string, opts?: SubscribeOptions): Promise<SubscriberInfo[]>;
    publish(topic: string, payload: any): Promise<DispatchResponse[]>;
  }

  class NknTransport extends BaseTransport {
    static type: string;
    key: any;
    fee: any;
    numBlocks: any;
    maxRetries: any;
    client: any;
    addr: string;

    protected _connect(): Promise<void>;
    protected _send(dest: string, payload: any, opts?: SendMessageOptions): Promise<any>;
    getWallet(wallet?: any): any;
    readonly wallet: any;
    subscribe(topic: string, metadata: string, num?: number, fee?: number, wallet?: any): Promise<void>;
    unsubscribe(topic: string): Promise<boolean>;
    getSubscribers(topic: string, opts?: any): Promise<SubscriberInfo[]>;
    publish(topic: string, data: any, opts?: any, excludeSelf?: boolean): Promise<DispatchResponse[]>;
  }

  class Newk {
    static classes: {
      transport: {
        bus: typeof BusTransport;
        nkn: typeof NknTransport;
      };
      decorator: {
        pubsub: typeof PubSubDecorator;
        entry: typeof EntryDecorator;
        seeder: typeof SeederDecorator;
        encryption: typeof EncryptionDecorator;
      };
    };

    registry: Registry;
    transport: BaseTransport;
    router: Router;
    addr: string;

    constructor(opts: any, transport?: BaseTransport);

    static init(...args: any[]): Promise<Newk>;
    addRoute(action: string, handler: (data: any, src?: string) => any): void;
    addRoutes(obj: object, path?: string): void;
    send(dest: string | { addr: string }, payload: any, opts?: SendMessageOptions): Promise<any>;
    dispatch(dest: string, type: string, data: any, opts?: SendMessageOptions): Promise<any>;
    receive({ payload, src }: Payload): Promise<any>;
    onMessage(handler: (message: any) => void): void;
    subscribe(topic: string, meta?: string): Promise<void>;
    unsubscribe(topic: string): Promise<void>;
    getSubscribers(topic: string, metadata?: any): Promise<SubscriberInfo[]>;
    discover(topic: string, metadata?: any, ...args: any[]): Promise<SubscriberInfo[]>;
    publish(topic: string, payload: any): Promise<void>;
    broadcast(topic: string, type: string, data: any, opts?: SendMessageOptions, excludeSelf?: boolean): Promise<DispatchResponse[]>;
    onPing(data: any, src: string): Promise<{ result: string }>;
  }
}
