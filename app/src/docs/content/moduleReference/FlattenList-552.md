
[comment]: # (ListCanvasModule)
Flattens lists inside a list, e.g. `[1, [2, 3], [4, 5], 6, [7, 8], 9]` -> `[1, 2, 3, 4, 5, 6, 7, 8, 9]`. If *deep = true*, flattening will be done recursively. E.g. `[1, [2, [3, [4, 5, [6]]], 7], 8, 9]` -> `[1, 2, 3, 4, 5, 6, 7, 8, 9]`. Otherwise only one level of flattening will be perfomed.
