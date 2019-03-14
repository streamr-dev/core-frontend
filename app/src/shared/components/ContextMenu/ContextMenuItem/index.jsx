// @flow

import React from 'react'

import styles from './contextMenuItem.pcss'

export type Props = {
    text: string,
    onClick: () => void,
}

class ContextMenuItem extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        if (this.props.onClick) {
            this.props.onClick()
        }
    }

    render = () => {
        const { text } = this.props
        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
                role="button"
                className={styles.item}
                onClick={this.onClick}
                tabIndex="0"
            >
                {text}
            </div>
        )
    }
}

export default ContextMenuItem
