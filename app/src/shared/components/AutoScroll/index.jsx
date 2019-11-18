// @flow

import React from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'

import RouteWatcher from '$shared/containers/RouteWatcher'
import ModalContext from '$shared/contexts/Modal'

/**
 * AutoScroll controls the page load scroll behaviour for the entire app,
 * it is triggered when there's a change in page location.
 * If the URL contains a hash, scroll to it.
 * If the URL is really long, avoid nauseous smooth scroll up.
 * Otherwisee, default action is to smooth scroll to top on page load/navigation.
 */

class AutoScroll extends React.Component<{}> {
    static contextType = ModalContext

    scroll = (urlHash?: string) => {
        const root = document.getElementById('root')
        const { isModalOpen } = this.context

        if (urlHash) {
            const elementId = urlHash.substr(1)
            const hashReference = document.getElementById(elementId)

            if (hashReference) {
                scrollIntoView(hashReference, {
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                })
            }
        } else if (root && !isModalOpen && window.pageYOffset > 2000) {
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
            <RouteWatcher onChange={(urlHash) => this.scroll(urlHash)} />
        )
    }
}

export default AutoScroll
