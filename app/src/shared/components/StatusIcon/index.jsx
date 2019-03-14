// @flow

import React from 'react'
import cx from 'classnames'

import styles from './statusIcon.pcss'

type Props = {
    status?: 'ok' | 'error' | 'inactive',
    className?: string,
}

export default class StatusIcon extends React.Component<Props> {
    static ERROR = 'error'
    static OK = 'ok'
    static INACTIVE = 'inactive'

    static defaultProps = {
        status: StatusIcon.INACTIVE,
    }

    render() {
        const { status, className } = this.props

        return (
            <div
                className={cx(className, styles.status, {
                    [styles.ok]: status === StatusIcon.OK,
                    [styles.error]: status === StatusIcon.ERROR,
                    [styles.inactive]: status === StatusIcon.INACTIVE,
                })}
            />
        )
    }
}
