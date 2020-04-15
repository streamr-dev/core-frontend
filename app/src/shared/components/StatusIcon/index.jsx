// @flow

import React from 'react'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'

import styles from './statusIcon.pcss'

export type Status = 'ok' | 'error' | 'inactive' | 'pending'

type Props = {
    status?: Status,
    className?: string,
    tooltip?: boolean | string,
}

export default class StatusIcon extends React.Component<Props> {
    static ERROR = 'error'
    static OK = 'ok'
    static INACTIVE = 'inactive'
    static PENDING = 'pending'

    static defaultProps = {
        status: StatusIcon.INACTIVE,
        tooltip: false,
    }

    render() {
        const { status, className, tooltip } = this.props

        let statusText

        if (tooltip) {
            statusText = (typeof tooltip === 'string') ? tooltip : I18n.t(`shared.status.${status || StatusIcon.INACTIVE}`)
        }

        return (
            <div
                data-statustext={statusText}
                className={cx(className, styles.status, {
                    [styles.ok]: status === StatusIcon.OK,
                    [styles.error]: status === StatusIcon.ERROR,
                    [styles.inactive]: status === StatusIcon.INACTIVE,
                    [styles.pending]: status === StatusIcon.PENDING,
                    [styles.showTooltip]: !!tooltip,
                })}
            />
        )
    }
}
