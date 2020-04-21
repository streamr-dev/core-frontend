export default () => {
    if (typeof window === 'undefined') {
        return 0
    }

    const { body, documentElement: html } = window.document

    return Math.round(window.pageYOffset || (html || body.parentNode || body).scrollTop)
}
