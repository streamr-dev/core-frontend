
[comment]: # (TimeSeriesCanvasModule)
This module will delay the received values by a number of events. For example, if the ** delayEvents** parameter is set to 1, the module will always output the previous value received.
  


The module will not produce output until the **delayEvents+1**th event, at which point the first received value will be output. For example, if the parameter is set to 2, the following sequence would be produced:
  


<table>
<tr><th>Input</th><th>Output</th></tr>
<tr><td>1</td><td>(no value)</td></tr>
<tr><td>2</td><td>(no value)</td></tr>
<tr><td>3</td><td>1</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>...</td><td>...</td></tr>
</table>