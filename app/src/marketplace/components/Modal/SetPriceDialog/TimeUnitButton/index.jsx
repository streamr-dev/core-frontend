// @flow

import React from 'react'
import classNames from 'classnames'
import { capital } from 'case'

import type { TimeUnit } from '../../../../../../../marketplace/src/flowtype/common-types'
import withI18n from '../../../../../../../marketplace/src/containers/WithI18n/index'

import styles from './timeUnitButton.pcss'

type Props = {
    value: TimeUnit,
    className?: string,
    active: boolean,
    onClick: (TimeUnit) => void,
    translate: (key: string, options: any) => string,
}

export class TimeUnitButton extends React.Component<Props> {
    onClick = () => {
        const { onClick, value } = this.props
        onClick(value)
    }

    render() {
        const { value, className, active, translate } = this.props

        return (
            <div className={classNames(className, styles.root, active && styles.active)}>
                <button type="button" onClick={this.onClick}>
                    {capital(translate(`common.timeUnit.${value}`))}
                </button>
            </div>
        )
    }
}

export default withI18n(TimeUnitButton)
