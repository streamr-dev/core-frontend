export const subscribeSnippets = ({ id }) => ({
    javascript: `
        const StreamrClient = require('streamr-client')

        const streamr = new StreamrClient({
            auth: {
                apiKey: 'YOUR-API-KEY',
            },
        })

        // Subscribe to a stream
        streamr.subscribe({
            stream: '${id}',
        },
        (message, metadata) => {
            // Do something with the message here!
            console.log(message)
        }
    `,
    java: `
        StreamrClient client = new StreamrClient();
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

export const publishSnippets = ({ id }) => ({
    javascript: `
        const StreamrClient = require('streamr-client')

        const client = new StreamrClient({
            auth: {
                privateKey: 'your-private-key',
            }
        })

        client.publish('${id}', {
            temperature: 25.4,
            humidity: 10,
            happy: true,
        })
    `,
    java: `
        StreamrClient client = new StreamrClient();
        Stream stream = client.getStream("${id}");

        Map<String, Object> msg = new LinkedHashMap<>();
        msg.put("foo", "bar");
        msg.put("random", Math.random());

        client.publish(stream, msg);
    `,
})
