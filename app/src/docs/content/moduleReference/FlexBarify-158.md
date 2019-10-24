
[comment]: # (TimeSeriesCanvasModule)
Similar to the **Barify** module, which creates open-high-low-close bars equally long in **time**, this module creates bars equally long in an arbitrary variable passed into the **valueLength** input. Incoming **valueLength** is summed for the current bar until **barLength** is reached, at which point the outputs are sent and the bar is reset. Note that if multiple bars would be filled on the same event, only one is output. To avoid this situation you may want to keep **barLength** substantially larger than incoming **valueLength**.
