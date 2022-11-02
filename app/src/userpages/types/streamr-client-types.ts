export type Subscription = {
    bind: (...args: Array<any>) => any;
    unbind: (...args: Array<any>) => any;
};
export type ModuleOptions = {
    uiResendAll?: {
        type: 'boolean';
        value: boolean;
    };
    uiResendLast?: {
        type: 'number';
        value: number;
    };
};
export type StreamId = string;
export type SubscriptionOptions = {
    stream?: StreamId;
    apiKey?: string;
    partition?: number;
    resend_all?: boolean;
    // TODO: Update these to new streamr client spec
    resend_last?: number;
    resend_from?: number;
    resend_from_time?: number | Date;
    resend_to?: number;
};
type Callback = (e: Event | null | undefined) => void;
type ClientEvent = 'subscribed' | 'unsubscribed';
export type StreamrClient = {
    connect: () => void;
    disconnect: () => void;
    pause: () => void;
    subscribe: (arg0: SubscriptionOptions, arg1: (...args: Array<any>) => any) => Subscription;
    unsubscribe: () => void;
    unsubscribeAll: () => void;
    getSubscriptions: () => void;
    bind: (event: ClientEvent, callback: Callback) => void;
    unbind: (event: ClientEvent, callback: Callback) => void;
};
