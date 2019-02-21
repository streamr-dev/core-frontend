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
