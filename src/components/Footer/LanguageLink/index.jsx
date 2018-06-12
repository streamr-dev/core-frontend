// @flow

import * as React from 'react'

type Props = {
    value: string,
    onClick: (string) => void,
    children: React.Node,
}

class LanguageLink extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { onClick, value } = this.props

        e.preventDefault()
        onClick(value)
    }

    render = () => {
        const { value, onClick, children, ...props } = this.props

        return (
            <a href="#" {...props} onClick={this.onClick}>
                {children}
            </a>
        )
    }
}

export default LanguageLink
