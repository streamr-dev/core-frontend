# Docs Editing Guide
[MDX](https://github.com/mdx-js/mdx) is a React flavoured Markdown rendering library that is powering the Docs. MDX offers the best styling/functionality at the expense of being harder to edit than vanilla MD files.

Since the Docs now live inside the unified Platform App, contributing developers will need to know a little React, and test that their changes do not break the build by inspecting the page and make sure the project compiles normally. Please refer to the main readme of this project for details on how to compile the platform app. Docker is not required.

### Folder organisation
The Docs MDX content is held in `/src/docs/content`. This content is rendered inside the page components inside `/src/docs/components`.

### Styling
Most of the styling rules can be found in the `DocsLayout` component. All Docs pages inherit from this components and its styles. 

### Headings, Lists & Tables
Headings and tables use the native MD syntax.
H1: Page title
H2: Section title
H3: Nested section title 

### Code snippets
For short inline text code snippets, the native MD implementation is fine. When working with longer code snippets we use the CodeSnippet component that uses react-syntax-highlighter under the hood. It is best to keep export the code snippets from `/src/docs/code/...` as the raw code can sometimes interfere with the markdown parser. 

```
import CodeSnippet from '$shared/components/CodeSnippet'

<CodeSnippet language='javascript' wrapLines showLineNumbers >{referencedCodeSnippet}</CodeSnippet> 

```

### Images
Images are stored in their respective folders inside `/src/docs/images/...` and are imported like any React Asset. 

E.G. 

```
import DataStream from './images/tutorials/data-stream.png'

<img src={DataStream} />

```

### Videos

```
<div className={styles.playerWrapper}>
    <ReactPlayer
        controls
        className={styles.reactPlayer}
        url="https://www.dropbox.com/s/tqtll9b45692hhv/Marketplace_UI%20Walkthrough_70s_180509.mov?dl=0"
        width="100%"
        height="100%"
    />
</div>
```

### In page navigation
The navigation that powers the sidebar, mobile and page turner controls is found in `/src/docs/components/DocsLayout/Navigation/`. The `ScrollableAnchor` library is used with the navigation to navigate to and highlight each section on scroll. Each sub navigation section should be wrapped with a ScrollableAnchor,
E.G.

```
<ScrollableAnchor id="publish-to-a-stream"><div>
... content ... 
</div></ScrollableAnchor>
```