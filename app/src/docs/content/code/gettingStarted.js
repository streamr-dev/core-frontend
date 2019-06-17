/* eslint-disable no-template-curly-in-string */

export const ClientSub =
`const sub = client.subscribe(
    {
        stream: 'streamId',
        apiKey: 'secret',       // Optional. If not given, uses the apiKey given at client creation time.
        partition: 0,           // Optional, defaults to zero. Use for partitioned streams to select partition.
        // optional resend options here
    },
    (message, metadata) => {
        // This is the message handler which gets called for every incoming message in the Stream.
        // Do something with the message here!
    }
)`

export const Example1 =
`const StreamrClient = require('streamr-client')
const ruuvi = require('node-ruuvitag')
const API_KEY = 'MY-API-KEY'
const client = new StreamrClient({
    apiKey: API_KEY
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

export const Example2a =
`const BFX = require('bitfinex-api-node')
const StreamrClient = require('streamr-client')
const STREAM_ID = 'MY-STREAM-ID'
const API_KEY = 'MY-API-KEY'
const bws = new BFX('', '', {
    version: 2,
    transform: true
}).ws
const client = new StreamrClient({
    apiKey: API_KEY
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

// defining these variables to portray the code example accurately
const location = '${location}'
const OPENWEATHERMAP_API_KEY = '${OPENWEATHERMAP_API_KEY}'
const stream = {}
stream.id = '${stream.id}'

export const Example3a =
`const fetch = require('node-fetch')
const StreamrClient = require('streamr-client')
const OPENWEATHERMAP_API_KEY = 'MY-OPENWEATHERMAP-KEY'
const STREAMR_API_KEY = 'MY-STREAMR-KEY'
const POLL_INTERVAL = 15 * 60 * 1000 // 5 minutes
const location = 'Zug,Switzerland'
const client = new StreamrClient({
    apiKey: STREAMR_API_KEY
})
// Query data from OWM and produce the result to Streamr
function pollAndProduce(stream) {
    fetch(\`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${OPENWEATHERMAP_API_KEY}&units=metric\`)
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
    name: \`Weather in ${location}\`,
    description: 'From openweathermap.org, updated every 15 minutes'
}).then((stream) => {
    console.log(\`Target Stream id: ${stream.id}\`)
    // Poll and produce now
    pollAndProduce(stream)
    // Keep repeating every 15 minutes
    setInterval(() => pollAndProduce(stream), POLL_INTERVAL)
}).catch((err) => {
    console.log(err)
})`

export const PythonRequests =
`import requests

msg = {
    'foo': 'hello',
    'bar': 24.5
}

requests.post('https://www.streamr.com/api/v1/streams/MY-STREAM-ID/data', json=msg, headers={'Authorization': 'Bearer MY-SESSION-TOKEN'})`
