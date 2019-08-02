
[comment]: # (VisualizationsCanvasModule)
This module displays a map based on an user-defined image. The image is loaded from a **URL** given in module options. The map automatically scales **x** and **y** coordinates between 0..1 to image dimensions. This means that regardless of image size in pixels (x,y) = (0,0) is the top left corner of the image, and (1,1) is the bottom right corner.  

Markers also have an **id**. To draw multiple markers, connect the **id** input. Coordinates for the same id will move the marker, and coordinates for a new id will create a new marker.  

In module options, you can enable directional markers to expose an additional **heading** input, which controls marker heading (e.g. direction in which people are facing in a space). Other options include marker coloring, autozoom behavior etc.