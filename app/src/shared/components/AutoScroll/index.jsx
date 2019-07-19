// @flow

import React from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'

import RouteWatcher from '$shared/containers/RouteWatcher'
import ModalContext from '$shared/contexts/Modal'

class AutoScroll extends React.Component<{}> {
    static contextType = ModalContext

    scroll = () => {
        const root = document.getElementById('root')
        const { isModalOpen } = this.context

        // Edge case for really long pages
        // Snap straight to top
        if (root && !isModalOpen && window.pageYOffset > 2000) {
            window.scrollTo(0, 0)
        } else if (root && !isModalOpen) {
            scrollIntoView(root, {
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
