// `data-test-hook` is there solely for the sake of making testing easier. Include thing plugin in
// any environment you want to drop them from the final HTML code.
//
// <h1 data-test-hook="main-headline">Hello world!</h1>
//
// with the plugin enabled turns into:
//
// <h1>Hello world!</h1>

module.exports = () => ({
    visitor: {
        JSXAttribute(path) {
            if (path.node.name.name === 'data-test-hook') {
                path.remove()
            }
        },
    },
})
