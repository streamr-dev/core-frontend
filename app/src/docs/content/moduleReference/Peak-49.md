
[comment]: # (TimeSeriesCanvasModule)
Attempts to detect upward turns below **lowZone** (outputs 1) and downward turns below **highZone** (outputs -1). For an upward turn to be registered, the change between subsequent input values must be larger than **threshold**. For a downward turn the change must be less than **-threshold**.
