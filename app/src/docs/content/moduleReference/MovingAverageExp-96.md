
[comment]: # (TimeSeriesCanvasModule)
Smooths the incoming time series by calculating an exponential moving average (EMA)  





	- $$EMA(t) = a x **in**(t) + (1-a) x EMA(t-1)$$
	- $$a = <span class="math-tex">\(2 \over \text{length} + 1\)$$