export default (id) => ({
    javascript: `
        const StreamrClient = require('streamr-client')

        const streamr = new StreamrClient({
            auth: {
                apiKey: 'YOUR-API-KEY',
            },
        })

        // Subscribe to a stream
        streamr.subscribe({
            stream: '${id}'
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
