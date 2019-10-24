
[comment]: # (Time & DateCanvasModule)
Takes a date as an input in either in [Date](https://docs.oracle.com/javase/8/docs/api/java/util/Date.html) object, timestamp(ms) or in string notation. If the input is in text form, is the given format used.  See example below.

Parameters  


	- Format <- "yyyy-MM-dd HH:mm:ss"
	- Timezone <- Europe/Helsinki

Inputs  


	- Date in <- "2015-07-15 13:06:13" or 1436954773474


Outputs   



	- Date out -> 2015-07-15 13:06:13
	- ts -> 1436954773474
	- dayOfWeek -> "Wed"
	- years -> 2015
	- months -> 7
	- days -> 15
	- hours -> 13
	- minutes -> 6
	- seconds -> 13
	- milliseconds -> 0
