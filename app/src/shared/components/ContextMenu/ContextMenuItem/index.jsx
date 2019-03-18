// @flow

import React from 'react'
import cx from 'classnames'

import styles from './contextMenuItem.pcss'

export type Props = {
    text: string,
    onClick: () => void,
    className: string,
}

class ContextMenuItem extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        if (this.props.onClick) {
            this.props.onClick()
        }
    }

    render = () => {
        const { text, className } = this.props
        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
                role="button"
                className={cx(styles.item, className)}
                onClick={this.onClick}
                tabIndex="0"
            >
                {text}
            </div>
        )
    }
}

export default ContextMenuItem
