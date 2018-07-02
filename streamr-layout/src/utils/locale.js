export const isLocalized = (pathname, availableLocals) => (
    !!pathname && new RegExp(`/(?:${availableLocals.join('|')})(?:$|/)`).test(pathname)
)

export const localize = (pathname, locale, availableLocals) => {
    const pn = pathname || ''
    if (locale) {
        if (isLocalized(pn, availableLocals)) {
            return pn.replace(/^\/\w{2}/, `/${locale}`)
        }
        return `/${locale}${pn}`
    }
    return pn
}
