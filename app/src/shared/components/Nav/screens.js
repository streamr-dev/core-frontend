// @flow

const screensToClassNames = (mobile: boolean, desktop: boolean) => {
    if (mobile && !desktop) {
        return ['d-md-none']
    }
    if (desktop && !mobile) {
        return ['d-none', 'd-md-block'] // TODO: what if we want display: inline;?
    }
    return []
}

export default screensToClassNames
