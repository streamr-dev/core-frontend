export const JavascriptExample =
`// Create the client using an Ethereum account.
const client = new StreamrClient({
  auth: {
    privateKey: 'your-private-key'
  }
})

// Look up or create the stream. Can also get it by id.
const stream = await client.getOrCreateStream({
  name: 'stream-name',
})

// Create the event to publish
const msg = {
  temperature: 25.4,
  humidity: 10,
  happy: true
}

// Publish it using the stream's id
client.publish(stream.id, msg)

// Or subscribe to receive messages published by other clients
const sub = client.subscribe(
  {
    stream: stream.id,
  },
  // The "message" variable includes the "content" plus other metadata information
  (content, message) => {
    // Here you can react to the latest message's content, you probably don't need
    // the metadata information contained in "message".
    console.log(content)
  }
)

// Unsubscribe when you don't want to receive messages anymore.
client.unsubscribe(sub)`
