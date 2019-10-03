
[comment]: # (TextCanvasModule)
For template syntax, see [StringTemplate cheatsheet](https://github.com/antlr/stringtemplate4/blob/master/doc/cheatsheet.md).  

Values of the **args** map are added as substitutions in the template. For example, incoming map **{name: "Bernie", age: 50}** substituted into template "**Hi, <name>!**" would produce string "Hi, Bernie!"  

Nested maps can be accessed with dot notation: **{name: "Bernie", pet: {species: "dog", age: 3}}** substituted into "**What a cute <pet.species>!**" would result in "What a cute dog!".  

Lists will be smashed together: **{pals: ["Sam", "Herb", "Dud"]}** substituted into "**BFF: me, <pals>**" results in "BFF: me, SamHerbDud". Separator must be explicitly given: "**BFF: me, <pals; separator=", ">**" gives "BFF: me, Sam, Herb, Dud".  

Transforming list items can be done with *{ x | f(x) }* syntax, e.g. **{pals: ["Sam", "Herb", "Dud"]}** substituted into "**<pals: { x | Hey <x>! }> Hey y'all!**" results in "Hey Sam! Hey Herb! Hey Dud! Hey y'all!".