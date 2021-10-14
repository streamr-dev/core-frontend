export const CreateJavascriptClient =
`const streamr = new StreamrClient({
    auth: {
        privateKey: 'your-ethereum-private-key',
    },
})`

export const CreateJavaClient = `AuthenticationMethod method = new EthereumAuthenticationMethod("YOUR-PRIVATE-KEY");
StreamrClient client = new StreamrClient(method);`

export const AuthJavascriptClient =
`new StreamrClient({
    auth: {
        ethereum: window.ethereum,
    }
})`

export const AuthJavaClient = 'StreamrClient client = new StreamrClient(new EthereumAuthenticationMethod(myEthereumPrivateKey));'

export const SubscribeJavascriptClient =
`// Subscribe to a stream
const subscription = await client.subscribe({
    stream: 'my-stream-id',
},
(message) => {
    // This function will be called when new messages occur
    console.log(JSON.stringify(message))
})`

export const SubscribeJavaClient =
`Subscription sub = client.subscribe(stream, new MessageHandler() {
    @Override
    void onMessage(Subscription s, StreamMessage message) {
        // Here you can react to the latest message
        System.out.println(message.getPayload().toString());
    }
})`

export const PublishJavascriptClient =
`// Here is the message we'll be sending
const msg = {
    hello: 'world',
    random: Math.random()
}

// Publish the message to the Stream
await client.publish('my-stream-id', msg)`

export const PublishJavaClient =
`// Create the message payload, which is represented as a Map
Map<String, Object> msg = new LinkedHashMap<>();
msg.put("foo", "bar");
msg.put("random", Math.random());

// Then publish it!
client.publish(stream, msg);`
