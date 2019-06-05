const postcss = require('postcss')

module.exports = postcss.plugin('postcss-reverse-props', () => (root) => {
    root.walkDecls((decl) => {
        // eslint-disable-next-line no-param-reassign
        decl.value = decl.value.replace(/(-?\d*(\.\d*)?\d)um/g, 'calc($1 * var(--um))')
    })
})
