// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

type Props = {
    className: string,
}

export const NO_SCROLL = 'overflow-hidden'
export const PAGE_SECONDARY = 'page-secondary'

class BodyClass extends React.Component<Props> {
    static classList: Array<string> = []

    componentWillMount() {
        const { className } = this.props
        const { classList } = BodyClass

        if (classList.indexOf(className) === -1) {
            classList.push(className)
        }
    }

    componentWillUnmount() {
        const { className } = this.props
        const { classList } = BodyClass

        if (classList.indexOf(className) !== -1) {
            classList.splice(classList.indexOf(className), 1)
        }
    }

    render = () => (
        <Helmet
            bodyAttributes={{
                class: BodyClass.classList.join(' '),
            }}
        />
    )
}

export default BodyClass
