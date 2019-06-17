export const PublishMsgJSClient =
`// Create the client and authenticate using an API key:
const client = new StreamrClient({
    apiKey: 'MY-API-KEY'
})

// Here is the event we'll be sending
const msg = {
    hello: 'world',
    random: Math.random()
}

// Publish the event to the Stream
client.publish('MY-STREAM-ID', msg)
    .then(() => console.log('Sent successfully: ', msg))
    .catch((err) => console.error(err))`

export const NodeRestlerExample =
`var restler = require('restler');

var msg = {
    foo: "hello",
    bar: 24.5
}

restler.post('https://www.streamr.com/api/v1/streams/MY-STREAM-ID/data', {
    headers: {
        Authorization: "Bearer MY-SESSION-TOKEN"
    },
    data: JSON.stringify(msg)
})`

export const PythonRequests =
`import requests

msg = {
    'foo': 'hello',
    'bar': 24.5
}

requests.post('https://www.streamr.com/api/v1/streams/MY-STREAM-ID/data', json=msg, headers={'Authorization': 'Bearer MY-SESSION-TOKEN'})`

export const SubscribingJSClient =
`// Create the client and authenticate using an API key:
const client = new StreamrClient({
    apiKey: 'MY-API-KEY'
})

// Subscribe to a stream
const subscription = client.subscribe(
    {
        stream: 'MY-STREAM-ID',
    },
    function(message) {
        // This function will be called when new messages occur
        console.log(JSON.stringify(message))
    }
)`
