
[comment]: # (UtilsCanvasModule)
Generates an RGBA color string based on the combination of its inputs. 

The `Min Value` input correlates to the `Min Color` input. The `Max Value` input correlates to the `Max Color` input. The color output is determined by the `in` input in relation to these boundary values.

For example, 
`Min Value = 0`
`In = 0`
`Min Color = Output Color` (e.g. White)

Where,
`Max Value = 1`
`In = 1`
`Max Color = Output Color` (e.g. Black)
 
Where, 
`In = 0.5`
Output color will be grey (rgba(128,128,128,1))