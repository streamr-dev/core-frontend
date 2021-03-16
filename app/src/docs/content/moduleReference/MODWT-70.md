
[comment]: # (TimeSeriesCanvasModule)
This module implements a real-time maximal overlap discrete wavelet transform (MODWT). A number of different wavelets are available. Note that, like all filters, the MODWT introduces increasing amounts of delay with higher levels of smoothing. No additional delay is added to any level, which means that a multi-level decomposition is not aligned at a given time. Reconstructing the original signal would require adding delay to all but the last level.
