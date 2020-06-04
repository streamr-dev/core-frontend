# Docs Editing Guide
**Streamr welcomes all edits and contributions to the Streamr Docs.**

The Streamr Docs are powered with [MDX](https://github.com/mdx-js/mdx). MDX is a format that allows for JSX inside markdown documents. The MDX files can be edited directly and new content can also be contributed to the docs as pure markdown -  ***a Streamr developer will make any necessary polish before merging the PR***.

### Content guidelines

- Please assume that the readers are junior-to-moderately experienced developers who are familiar with basic things like using the command line, working with APIs etc. On the other hand, the reader may not be experienced with crypto, blockchain, decentralization, and peer-to-peer technologies.
- Regarding content that originally exists elsewhere, please link (blog posts) or embed (videos) instead of duplicating or copy-pasting. Avoid repeating content.
- Add details progressively, so that the essence of the section can be understood compactly and with relative ease, and add details as the reader progresses further.
- Use consistent terminology (established in Introduction section).
- Use a “Further reading” section in the end to point to more detailed internal/external content like blog posts, further videos, related topics, detailed specs, etc.

### Folder organisation
The Docs MDX content files are held in `/src/docs/content`. This content is rendered inside the page components inside `/src/docs/components`.

### Styling
Most of the styling rules can be found in the `DocsLayout` component. All Docs pages inherit from this components and its styles. 

### Headings, Lists & Tables
Headings, lists and tables use the native MD syntax.
H1: Page title
H2: Section title
H3: Nested section title 

### Streamr code snippets
For short inline text code snippets, the native MD implementation is suitable. When working with longer code snippets we use our CodeSnippet component that uses `react-syntax-highlighter` under the hood. It's best to export the code snippets from `/src/docs/code/...` as the raw code can sometimes interfere with the markdown parser. 

```
import { CodeSnippet } from '@streamr/streamr-layout'

<CodeSnippet language="javascript" wrapLines showLineNumbers >{referencedCodeSnippet}</CodeSnippet> 

```

### Images
Images are stored in their respective folders inside `/src/docs/images/...` and are imported like any React asset. 

E.G. 

```
import DataStream from './images/tutorials/data-stream.png'

<div className={docsStyles.centered}>
  <img src={DataStream} />
</div>
```

### In-page navigation
The navigation that powers the sidebar, mobile and page turner controls is found in `/src/docs/components/DocsLayout/Navigation/`. In general, surrounding html/jsx elements with a empty lines helps the MDX parser switch from MD to JSX.

E.G.

```
<section id="publish-to-a-stream">

... content ... 

</section>
```
