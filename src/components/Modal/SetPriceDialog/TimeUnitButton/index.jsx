// @flow

import React from 'react'
import classNames from 'classnames'

import titleize from '../../../../utils/titleize'
import type { TimeUnit } from '../../../../flowtype/common-types'

import styles from './timeUnitButton.pcss'

type Props = {
    value: TimeUnit,
    className?: string,
    active: boolean,
    onClick: (TimeUnit) => void,
}

class TimeUnitButton extends React.Component<Props> {
    onClick = () => {
        const { onClick, value } = this.props
        onClick(value)
    }

    render() {
        const { value, className, active } = this.props

        return (
            <div className={classNames(className, active && styles.active)}>
                <button type="button" onClick={this.onClick}>
                    {titleize(value)}
                </button>
            </div>
        )
    }
}

export default TimeUnitButton
