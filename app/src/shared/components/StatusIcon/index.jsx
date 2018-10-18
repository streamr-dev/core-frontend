// @flow

import React from 'react'
import cx from 'classnames'

import styles from './statusIcon.pcss'

type Props = {
    status?: 'ok' | 'error',
    className?: string,
}

export default class StatusIcon extends React.Component<Props> {
    static ERROR = 'error'
    static OK = 'ok'

    static defaultProps = {
        status: StatusIcon.OK,
    }

    render() {
        const { status, className } = this.props

        return (
            <div
                className={cx(className, styles.status, {
                    [styles.ok]: status === StatusIcon.OK,
                    [styles.error]: status === StatusIcon.ERROR,
                })}
            />
        )
    }
}
