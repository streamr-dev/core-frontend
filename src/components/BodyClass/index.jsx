// @flow

import React from 'react'

type Props = {
    className: string,
}

export const NO_SCROLL = 'overflow-hidden'

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
