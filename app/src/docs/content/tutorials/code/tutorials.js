/* eslint-disable no-template-curly-in-string */

export const JavaModule =
`// Define inputs and outputs here
// TimeSeriesInput input = new TimeSeriesInput(this,"in");
// TimeSeriesOutput output = new TimeSeriesOutput(this,"out");

public void initialize() {
    // Initialize local variables
}
 
public void sendOutput() {
    //Write your module code here
}
 
public void clearState() {
    // Clear internal state
}`

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

export const InputsAndOutputsExample =
`// Define inputs and outputs here
TimeSeriesInput value = new TimeSeriesInput(this,"Value");
StringInput source = new StringInput(this,"Source");
BooleanParameter mode = new BooleanParameter(this,"Mode");
TimeSeriesOutput score = new TimeSeriesOutput(this,"Score");
BooleanOutput match = new BooleanOutput(this,"Match?");`

export const JavaModuleDeclarations =
`private int counter;
private boolean active;
private double temperature;
private String greeting = "Hello world!";
private double[] assignments = new long[10];`

export const DefiningInputsAndOutputs =
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

export const ClearState =
`TimeSeriesInput in = new TimeSeriesInput(this, "in");
TimeSeriesOutput out = new TimeSeriesOutput(this, "out");
 
private double product;
 
public void initialize() {
    product = 1;
}
 
public void sendOutput() {
//Write your module code here
}
 
public void clearState() {
    product = 1;
}`

export const IncomingEvent =
`TimeSeriesInput in = new TimeSeriesInput(this, "in");
TimeSeriesOutput out = new TimeSeriesOutput(this, "out");
 
private double product;
 
public void initialize() {
    product = 1;
}
 
public void sendOutput() {
    // Read input.
    double newValue = in.getValue();
 
    // Update the state.
    product = product * newValue;
 
    // Send output.
    out.send(product);
}
 
public void clearState() {
    product = 1;
}`

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

export const PythonRequests =
`import requests

msg = {
    'foo': 'hello',
    'bar': 24.5
}

requests.post('https://streamr.network/api/v1/streams/MY-STREAM-ID/data', json=msg, headers={'Authorization': 'Bearer MY-SESSION-TOKEN'})`
