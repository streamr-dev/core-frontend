export const subscribeSnippets = ({ id }) => ({
    javascript: `
        const StreamrClient = require('streamr-client')

        const client = new StreamrClient({
            auth: {
                privateKey: 'YOUR-PRIVATE-KEY',
            },
        })

        // Subscribe to a stream
        client.subscribe({
            stream: '${id}',
        }, (message, metadata) => {
            // Do something with the message here!
            console.log(message)
        })
    `,
    java: `
        AuthenticationMethod method = new EthereumAuthenticationMethod("YOUR-PRIVATE-KEY");
        StreamrClient client = new StreamrClient(method);
        Stream stream = client.getStream("${id}");

        Subscription sub = client.subscribe(stream, new MessageHandler() {
            @Override
            void onMessage(Subscription s, StreamMessage message) {
                // Here you can react to the latest message
                System.out.println(message.getPayload().toString());
            }
        });
    `,
})

export const lightNodeSnippets = ({ id }) => ({
    javascript: `
        // Run a Streamr node right inside your JS app
        const StreamrClient = require('streamr-client')
        const streamr = new StreamrClient({
            auth: {
                privateKey: 'ethereum-private-key'
            }
        })
        
        // Publish messages to a stream
        streamr.publish('${id}', {
            hello: 'world',
        })
        
        // Or subscribe to a stream of messages
        streamr.subscribe('${id}', (msg) => {
            // Handle incoming messages
        })
    `,
})

export const websocketSnippets = ({ id }) => ({
    javascript: `
        // You'll want to URI-encode the stream id
        const streamId = encodeURIComponent('${id}')
        
        // Connect to the Websocket plugin on your Streamr 
        // node and send JSON messages to publish them
        const pub = ws.connect(\`ws://my-streamr-node:7170/streams/\${streamId}/publish\`)
        pub.send({
            hello: 'world',
        })
        
        // Or subscribe to a stream of messages
        const sub = ws.connect(\`ws://my-streamr-node:7170/streams/\${streamId}/subscribe\`)
        sub.onmessage = (msg) => {
            // Handle incoming messages
        }
    `,
})

export const httpSnippets = ({ id }) => ({
    javascript: `
        // Use your favourite language and HTTP library!

        // You'll want to URI-encode the stream id
        const streamId = encodeURIComponent('${id}')
        
        // Publish messages to a stream by POSTing JSON 
        // to the HTTP plugin on your Streamr node
        http.post(\`http://my-streamr-node:7171/streams/\${streamId}\`, {
            hello: 'world'
        })
    `,
})

export const mqttSnippets = ({ id }) => ({
    javascript: `
        // Use your favourite language and MQTT library!

        // Connect to MQTT plugin on your Streamr node
        mqtt.connect('mqtt://my-streamr-node')
        
        // Publish a message to a stream
        mqtt.publish('${id}', {
            hello: 'world',
        })
        
        // Or subscribe to a stream of messages
        mqtt.subscribe('${id}', (msg) => {
            // Handle incoming messages
        })
    `,
})
