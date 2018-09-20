// @flow

export default (mobile: boolean, desktop: boolean) => desktop !== mobile && [desktop && 'hidden-sm-down', mobile && 'hidden-md-up']
