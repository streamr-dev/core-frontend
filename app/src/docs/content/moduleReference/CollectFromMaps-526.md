
[comment]: # (MapCanvasModule)
Given a list/map of maps, selects from each an entry according to parameter *selector*, and then returns a list/map of the collected entry values. In case a map does not have an entry for *selector*, or the value is null, that entry will be simply skipped in the resulting output.  

Map entry *selector* supports dot and array notation for selecting from nested maps and lists, e.g. "parents[1].name" would return ["Homer", "Fred"] for input [{name: "Bart", parents: [{name: "Marge"}, {name: "Homer"}]}, {name: "Pebbles", parents: [{name: "Wilma}, {name: "Fred"}]}]
