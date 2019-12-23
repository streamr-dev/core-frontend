// @flow

import React from 'react'
import cx from 'classnames'

import styles from './contextMenuItem.pcss'

export type Props = {
    text: string,
    onClick: (e: SyntheticInputEvent<EventTarget>) => void,
    className?: ?string,
    disabled?: boolean,
}

class ContextMenuItem extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        if (this.props.onClick) {
            this.props.onClick(e)
        }
    }

    render = () => {
        const { text, className, disabled, ...props } = this.props
        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
                {...props}
                role="button"
                className={cx(styles.item, className, {
                    [styles.disabled]: disabled,
                })}
                onClick={this.onClick}
                tabIndex="0"
            >
                {text}
            </div>
        )
    }
}

export default ContextMenuItem
