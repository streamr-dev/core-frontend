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

    render = () => (
        <a href="#" onClick={this.onClick}>
            {this.props.children}
        </a>
    )
}

export default LanguageLink
