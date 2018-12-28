// @flow

import React from 'react'

type Props = {
    className: string,
}

export const NO_SCROLL = 'overflow-hidden'
export const PAGE_SECONDARY = 'page-secondary'

class BodyClass extends React.Component<Props> {
    componentDidMount() {
        if (document.body) {
            document.body.classList.add(...this.props.className.split(/\s+/))
        }
    }

    componentWillUnmount() {
        if (document.body) {
            document.body.classList.remove(...this.props.className.split(/\s+/))
        }
    }

    render = () => null
}

export default BodyClass
