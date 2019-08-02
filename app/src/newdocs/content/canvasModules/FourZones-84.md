
[comment]: # (TimeSeriesCanvasModule)
This module waits for the input signal to reach either the **highTrigger** or **lowTrigger** level. Either 1 or -1 is output respectively. The triggered value is kept until it is set back to 0 at the corresponding release level.
  


If you set **mode** to **exit**, the output will trigger when exiting the trigger level instead of entering it.