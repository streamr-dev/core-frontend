
[comment]: # (TimeSeriesCanvasModule)
This module can be used to sample values from one timeseries upon events from another timeseries, just like the Sampler module.
  


However the **triggerIf** value must be equal to 1 for the value at **value** input to be sent out. Trigger events with other values than 1 will produce no effect.