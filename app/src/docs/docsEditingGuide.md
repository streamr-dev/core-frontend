n short, the documentation now lives as MDX files inside the Streamr Platform Repo, under, src/docs/content. 

MDX is React flavoured MarkDown and I have made a guide for developers that want to update the docs on their own. Since the docs now live inside the unified Platform App, developers will need to know a little React, and test that their changes do not break the build by inspecting the page and making sure `npm start` doesn't self imolate. There are some new capabilities, as well as some extra complexity. So tradeoffs have shifted slightly from the last version.

Other notes/questions:
- Getting started content was pieced together from Matt's Abstract pages and by finding Henri's greatest hits scattered on medium. I took some creative license on the wording/structure there.
- Streamr Engine section is a bit bare, suggestions for content sources?
- Lots of the images and some of the text will be immediately out of date when the new Editor/Userpages lands. I can perhaps work with the design team to update those one by one. 
- Module list page? Should we port this over or does the new Editor's inline help replace this?  https://www.streamr.com/module/list
- /docs/visual-editor: This has an out of date Twitter example linking to a non existant CSV on the current docs. Maybe we could remake this with the example from the Marketplace Twitter product?
- The api explorer is included as an iframe and seems to work out of the box. It's not in the current designs so let me know if you'd prefer an external link in its place. 
- We switch between calling the editor 'Streamr Editor' and 'Visual Editor' - should it be one or the other?
- 
