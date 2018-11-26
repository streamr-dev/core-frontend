// @flow

import * as React from 'react'
import cx from 'classnames'

import styles from './underline.pcss'

type Props = {
    className?: string,
    caution?: boolean,
    error?: boolean,
    processing?: boolean,
    success?: boolean,
    active?: boolean,
    children: React.Node,
}

class Underline extends React.PureComponent<Props> {
    render() {
        const {
            children,
            caution,
            error,
            processing,
            success,
            active,
            className,
        } = this.props

        return (
            <div
                className={cx(styles.root, className, {
                    [styles.caution]: caution,
                    [styles.error]: error,
                    [styles.processing]: processing,
                    [styles.success]: success,
                    [styles.active]: active,
                })}
            >
                {children}
            </div>
        )
    }
}

export default Underline
