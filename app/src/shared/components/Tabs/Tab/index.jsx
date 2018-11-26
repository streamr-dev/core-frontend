// @flow

import * as React from 'react'
import cx from 'classnames'
import styles from './tab.pcss'

type Props = {
    active?: boolean,
    className?: string,
    disabled?: boolean,
    index?: number,
    onClick?: (number) => void,
    title: string,
    link?: string,
}

class Tab extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { onClick, index, disabled, active } = this.props
        e.preventDefault()

        if (onClick && !disabled && !active) {
            onClick(index || 0)
        }
    }

    render() {
        const {
            active,
            className,
            title,
            disabled,
            link,
        } = this.props

        return (
            <a
                href={link || '#'}
                className={cx(className, styles.root, {
                    [styles.active]: !!active,
                    [styles.disabled]: !!disabled,
                })}
                onClick={this.onClick}
            >
                {title}
            </a>
        )
    }
}

export default Tab
