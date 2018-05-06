// @flow

export const disableScroll = () => document.body && document.body.classList.add('overflow-hidden')

export const enableScroll = () => document.body && document.body.classList.remove('overflow-hidden')
