# Load Resources [![Build Status][ci-img]][ci]

Load all JS/CSS files from site website.

```js
var load = require('load-resources');

load('https://github.com/', '.css', function (css, url) {
    // All GitHub styles will be here
})
```

Also you can set a array of sites as first argument.

Third argument of callback will be boolean to indicate last file.

[ci-img]: https://travis-ci.org/ai/load-resources.svg
[ci]:     https://travis-ci.org/ai/load-resources
