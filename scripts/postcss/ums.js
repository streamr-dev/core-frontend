const postcss = require('postcss')

// `um` is a unit representing 16px (`--um` variable). It's temporary. Current `rem` is
// contextual (depends on screen size). Once we fix that (make `rem` constant) we can
// replace all ums with rems. Simple as that.

module.exports = postcss.plugin('postcss-reverse-props', () => (root) => {
    root.walkDecls((decl) => {
        // eslint-disable-next-line no-param-reassign
        decl.value = decl.value.replace(/(-?\d*(\.\d*)?\d)um/g, 'calc($1 * var(--um))')
    })
})
