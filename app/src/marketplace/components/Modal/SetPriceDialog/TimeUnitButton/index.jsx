// @flow

import React from 'react'
import classNames from 'classnames'
import { capital } from 'case'
import { I18n } from 'react-redux-i18n'

import type { TimeUnit } from '$shared/flowtype/common-types'
import withI18n from '$mp/containers/WithI18n'

import styles from './timeUnitButton.pcss'

type Props = {
    value: TimeUnit,
    className?: string,
    active: boolean,
    onClick: (TimeUnit) => void,
}

export class TimeUnitButton extends React.Component<Props> {
    onClick = () => {
        const { onClick, value } = this.props
        onClick(value)
    }

    render() {
        const { value, className, active } = this.props

        return (
            <div className={classNames(className, styles.root, active && styles.active)}>
                <button type="button" onClick={this.onClick}>
                    {capital(I18n.t(`common.timeUnit.${value}`))}
                </button>
            </div>
        )
    }
}

export default withI18n(TimeUnitButton)
