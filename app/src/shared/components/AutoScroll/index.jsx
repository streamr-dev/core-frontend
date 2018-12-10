// @flow

import React from 'react'

import RouteWatcher from '$shared/containers/RouteWatcher'
import Modal from '$shared/components/Modal'

const scrollTop = () => {
    const root = document.getElementById('root')

    if (root && !Modal.isOpen()) {
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
