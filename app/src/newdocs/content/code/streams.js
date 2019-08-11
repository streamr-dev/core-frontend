export const CreateJavascriptClient =
`const client = new StreamrClient({
    auth: {
        apiKey: 'your-api-key'
    }
})`

export const CreateJavaClient = 'StreamrClient client = new StreamrClient(new ApiKeyAuthenticationMethod(myApiKey));'

export const AuthJavascriptClient =
`new StreamrClient({
    auth: {
        provider: web3.currentProvider,
    }
})`

export const AuthJavaClient = 'StreamrClient client = new StreamrClient(new EthereumAuthenticationMethod(myEthereumPrivateKey));'

export const SubscribeJavascriptClient =
`// Subscribe to a stream
const subscription = client.subscribe({
    stream: 'MY-STREAM-ID',
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
`// Here is the event we'll be sending
const msg = {
    hello: 'world',
    random: Math.random()
}

// Publish the event to the Stream
client.publish('MY-STREAM-ID', msg)
    .then(() => console.log('Sent successfully: ', msg))`

export const PublishJavaClient =
`// Create the message payload, which is represented as a Map
Map<String, Object> msg = new LinkedHashMap<>();
msg.put("foo", "bar");
msg.put("random", Math.random());

// Then publish it!
client.publish(stream, msg);`

export const DataPattern1 =
`const StreamrClient = require('streamr-client')
const ruuvi = require('node-ruuvitag')
const API_KEY = 'MY-API-KEY'
const client = new StreamrClient({
    auth: {
        apiKey: API_KEY
    }
})
const streams = {}
console.log('Listening for RuuviTags...')
ruuvi.on('found', tag => {
    // Create a Stream for this tag if it doesn't exist yet
    if (!streams[tag.id]) {
        streams[tag.id] = await client.getOrCreateStream({
            name: 'Ruuvi ' + tag.id
        })
    }
    tag.on('updated', async (data) => {
        const stream = streams[tag.id]
        try {
            // Produce the data point to the stream
            await stream.produce(data)
        } catch (err) {
            console.error(err)
        }
    })
})`

export const DataPattern2 =
`const BFX = require('bitfinex-api-node')
const StreamrClient = require('streamr-client')
const STREAM_ID = 'MY-STREAM-ID'
const API_KEY = 'MY-API-KEY'
const bws = new BFX('', '', {
    version: 2,
    transform: true
}).ws
const client = new StreamrClient({
    auth: {
        apiKey: API_KEY
    }
})
bws.on('open', () => {
    bws.subscribeTicker('DATUSD')
})
bws.on('ticker', (pair, ticker) => {
    console.log('Ticker:', ticker)
    client.produceToStream(STREAM_ID, ticker)
        .then(() => console.log('Sent to Streamr!'))
        .catch((err) => console.error(err))
})`

export const DataPattern3 =
`const fetch = require('node-fetch')
const StreamrClient = require('streamr-client')
const OPENWEATHERMAP_API_KEY = 'MY-OPENWEATHERMAP-KEY'
const STREAMR_API_KEY = 'MY-STREAMR-KEY'
const POLL_INTERVAL = 15 * 60 * 1000 // 5 minutes
const location = 'Zug,Switzerland'
const client = new StreamrClient({
    auth: {
        apiKey: API_KEY
    }
})
// Query data from OWM and produce the result to Streamr
function pollAndProduce(stream) {
    fetch(\`https://api.openweathermap.org/data/2.5/weather?q={location}&APPID={OPENWEATHERMAP_API_KEY}&units=metric\`)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            // Produce the data point to Streamr
            return stream.produce(json)
        }).catch((err) => {
            console.error(err)
        })
}
// Create a Stream for this location, if it doesn't exist
client.getOrCreateStream({
    name: \`Weather in {location}\`,
    description: 'From openweathermap.org, updated every 15 minutes'
}).then((stream) => {
    console.log(\`Target Stream id: {stream.id}\`)
    // Poll and produce now
    pollAndProduce(stream)
    // Keep repeating every 15 minutes
    setInterval(() => pollAndProduce(stream), POLL_INTERVAL)
}).catch((err) => {
    console.log(err)
})`
