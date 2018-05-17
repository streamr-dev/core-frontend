// @flow

import React from 'react'

type Props = {
    className: string,
}

export const NO_SCROLL = 'overflow-hidden'

class BodyClass extends React.Component<Props> {
    componentDidMount() {
        this.forEachClassName((className) => {
            if (document.body) {
                document.body.classList.add(className)
            }
        })
    }

    componentWillUnmount() {
        this.forEachClassName((className) => {
            if (document.body) {
                document.body.classList.remove(className)
            }
        })
    }

    forEachClassName = (cb: (string) => void) => {
        this.props.className.split(/\s+/).forEach(cb)
    }

    render = () => null
}

export default BodyClass
