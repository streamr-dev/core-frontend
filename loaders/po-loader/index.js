const { gettextToI18next } = require('i18next-conv')

function loader(source) {
    if (this.cacheable) {
        this.cacheable()
    }

    const callback = this.async()
    const language = (source.match(/Language:\s*(\w+)/) || [null, 'en'])[1]

    gettextToI18next(language, source).then((data) => callback(null, `module.exports = ${data};`))
}

module.exports = loader
