
[comment]: # (ListCanvasModule)
Generates a sequence of numbers increasing/decreasing according to a specified *step*.  

   

When *from < to* a growing sequence is produced. Otherwise (*from > to)* a decreasing sequence is produced. The sign of parameter *step* is ignored, and is automatically determined by the inequality relation between *from *and *to*.  

   

Parameter *to* acts as an upper bound which means that if sequence generation goes over *to*, the exceeding values are not included in the sequence. E.g., from=1, to=2, seq=0.3 results in [1, 1.3, 1.6, 1.9], with 2.1 notably not included.