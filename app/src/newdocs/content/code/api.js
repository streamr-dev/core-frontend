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
