/* eslint-disable no-template-curly-in-string */

export const InputsAndOutputs =
`// Define inputs and outputs here
TimeSeriesInput input = new TimeSeriesInput(this,"in");
TimeSeriesOutput output = new TimeSeriesOutput(this,"out");

public void initialize() {
    // Initialize local variables
}
 
public void sendOutput() {
    //Write your module code here
}
 
public void clearState() {
    // Clear internal state
}`

export const ClientSub =
`const streamr = new StreamrClient({
    auth: {
        privateKey: 'YOUR-PRIVATE-KEY',
    },
})

// Subscribe to a stream
streamr.subscribe({
    stream: '0xb722f00ea9eecdc3d2b990789e62beaa17568123/my-stream',
}, (message, metadata) => {
    // Do something with the message here!
    console.log(message)
})`

export const ClientPub =
`// Here's our example data point
const msg = {
    temperature: 25.4,
    humidity: 10,
    happy: true
}

// Publish using the Stream id only
client.publish('my-stream-id', msg)

// Or alternatively, via the Stream object (from e.g. getOrCreateStream)
stream.publish(msg)`
