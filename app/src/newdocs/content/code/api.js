export const JavaExample =
`// create the client using an Ethereum account.
String myEthereumPrivateKey = "0x..."
StreamrClient client = new StreamrClient(new EthereumAuthenticationMethod(myEthereumPrivateKey));

//Get the stream by its id (can also get it by name).
Stream stream = client.getStream("id-of-the-stream");

// Create the message payload, which is represented as a Map.
Map<String, Object> msg = new LinkedHashMap<>();
msg.put("foo", "bar");
msg.put("random", Math.random());

// Then publish it!
client.publish(stream, msg);

// Or subscribe to receive messages published by other clients
Subscription sub = client.subscribe(stream, new MessageHandler() {
  @Override
  void onMessage(Subscription s, StreamMessage message) {
    // Here you can react to the latest message
    System.out.println(message.getContent().toString());
  }
})

// Unsubscribe when you don't want to receive messages anymore.
client.unsubscribe(sub);`
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
export const PythonExample =
`# Create the client using Streamr account API key
option = Option.get_default_option()
option.auto_disconnect = False
option.auto_connect = False
option.api_key = 'your-api-key'
client = Client(my_option)

# Look up or create the stream. Can also get it by id using client.get_stream_by_id
stream = client.get_or_create_stream('stream-test')

# Create the event to publish
msg = {
  'temperature': 25.4,
  'humidity': 10,
  'happy': true
}

# Get stream id
stream_id = stream[0]['id']

# Publish it using the stream's id
client.publish(stream_id, msg)

# If we want to subscribe to a stream to receive messages instead
# Define a callback function to react to latest message's content
def callback(msg,_):
  print('message received . The Cotent is : %s'%(msg))

# Subscribe to receive messages published by other clients
client.subscribe(stream_id, callback)`
