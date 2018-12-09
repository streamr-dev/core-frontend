// @flow

import React from 'react'

import RouteWatcher from '$shared/containers/RouteWatcher'
import BodyClass, { NO_SCROLL } from '$shared/components/BodyClass'

const scrollTop = () => {
    const root = document.getElementById('root')

    if (root && !BodyClass.includes(NO_SCROLL)) {
        root.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        })
    }
}

const AutoScroll = () => (
    <RouteWatcher onChange={scrollTop} />
)

export default AutoScroll
