// @flow

import React from 'react'

import RouteWatcher from '$shared/containers/RouteWatcher'
import ModalContext from '$shared/contexts/Modal'

class AutoScroll extends React.Component<{}> {
    static contextType = ModalContext

    scroll = () => {
        const root = document.getElementById('root')
        const { isModalOpen } = this.context

        if (root && !isModalOpen) {
            root.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
    }

    render() {
        return (
            <RouteWatcher onChange={this.scroll} />
        )
    }
}

export default AutoScroll
