# PostCSS Parser Tests [![Build Status][ci-img]][ci]

<img align="right" width="95" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo.svg">

This project contains base tests for every [PostCSS] CSS parser, including:

* 24 CSS files to test extreme cases of the CSS specification.
* Integration tests by popular website styles to test CSS from the wild.

These tests are useful for any CSS parser, not just parsers within the PostCSS ecosystem.

## Cases

You can iterate through all test cases using the `cases.each` method:

```js
var cases = require('postcss-parser-tests');

cases.each( (name, css, ideal) => {
    it('parses ' + name, () => {
        let root = parse(css, { from: name });
        let json = cases.jsonify(root);
        expect(json).to.eql(ideal);
    });
});
```

This returns the case name, CSS string, and PostCSS AST JSON.

If you create a non-PostCSS parser, just compare if the input CSS is equal to the output CSS after parsing.

You can also get the path to some specific test cases using the `cases.path(name)` method.

## Integration

Integration tests are packed into a Gulp task:

```js
gulp.task('integration', function (done) {
    var cases  = require('postcss-parser-tests');
    let parser = require('./');
    cases.real(done, function (css) {
        return parser(css).toResult({ map: { annotation: false } });
    });
});
```

Your callback must parse CSS and stringify it back. The plugin will then compare the input
and output CSS.

You can add extra sites using an optional second argument:

```js
cases.real(done, [['Browserhacks', 'http://browserhacks.com/']],
    function (css) {

    });
```

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://img.shields.io/travis/postcss/postcss-parser-tests.svg
[ci]:      https://travis-ci.org/postcss/postcss-parser-tests
