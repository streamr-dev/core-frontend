// @flow

import React, { Component, Fragment } from 'react'
import classNames from 'classnames'
import { Label } from 'reactstrap'

import type { TimeUnit } from '../../../../flowtype/common-types'
import withI18n from '../../../../containers/WithI18n'

import style from './timeUnitSelector.pcss'

export type Props = {
    timeUnit: TimeUnit,
    onChange: (TimeUnit) => void,
    translate: (key: string, options: any) => string,
}

type State = {
    dropdownIsOpen: boolean,
}

class TimeUnitSelector extends Component<Props, State> {
    state = {
        dropdownIsOpen: false,
    }

    onDropdownToggle = () => {
        this.setState({
            dropdownIsOpen: !this.state.dropdownIsOpen,
        })
    }

    render() {
        const timeUnits = ['hour', 'day', 'week', 'month']
        const { timeUnit, onChange, translate } = this.props
        return (
            <Fragment>
                {timeUnits.map((unit) => (
                    <Label
                        className={
                            classNames({
                                [style.timeUnitSelector]: true,
                                [style.active]: timeUnit === unit,
                            })
                        }
                        check
                        key={unit}
                    >
                        <input
                            className={style.hiddenRadioButton}
                            type="radio"
                            name="timeUnit"
                            value={this.props.timeUnit}
                            onChange={() => onChange(unit)}
                        />
                        {translate(`modal.chooseAccessPeriod.${unit}`)}
                    </Label>
                ))}
            </Fragment>
        )
    }
}

export default withI18n(TimeUnitSelector)
