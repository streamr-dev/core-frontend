
[comment]: # (TimeSeriesCanvasModule)
This module will delay the received values by a number of events. For example, if the **delayEvents** parameter is set to 1, the module will always output the previous value received.
  
The module will not produce output until the **delayEvents+1**th event, at which point the first received value will be output. For example, if the parameter is set to 2, the following sequence would be produced. Input 1: output (no value), input 2: output (no value), input 3: output 1, input 4: output 2 ...
