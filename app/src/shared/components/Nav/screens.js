// @flow

// Display attribute is quite horrible way to do this but we can find out a better way later
const screensToClassNames = (mobile: boolean, desktop: boolean, display: string = 'inline-block') => {
    if (mobile && !desktop) {
        return ['d-md-none']
    }
    if (desktop && !mobile) {
        return ['d-none', `d-md-${display}`]
    }
    return []
}

export default screensToClassNames
