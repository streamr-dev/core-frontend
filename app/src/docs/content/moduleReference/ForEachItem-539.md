
[comment]: # (ListCanvasModule)
Execute a sub-canvas for each item of input lists. The exported inputs and outputs of sub-canvas *canvas* appear as list inputs and list outputs. The input lists are iterated element-wise, and the sub-canvas is executed every time a value is available for each input list. If input list sizes vary, the sub-canvas is executed as many times as the smallest list is of size. 

After the input lists have been iterated through, and the sub-canvas activated accordingly, lists of produced values are sent to output lists. The output *numOfItems* indicates how many times the sub-canvas was executed, i.e., the size of the smallest input list. You may want to look into the module **RepeatItem** when using this module to repeat parameter values etc.
