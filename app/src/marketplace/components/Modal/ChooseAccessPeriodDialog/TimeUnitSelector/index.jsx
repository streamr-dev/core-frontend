// @flow

import React, { Component, Fragment } from 'react'
import classNames from 'classnames'
import { Label } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import type { TimeUnit } from '$shared/flowtype/common-types'

import style from './timeUnitSelector.pcss'

export type Props = {
    timeUnit: TimeUnit,
    onChange: (TimeUnit) => void,
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
        const { timeUnit, onChange } = this.props
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
                        {I18n.t(`modal.chooseAccessPeriod.${unit}`)}
                    </Label>
                ))}
            </Fragment>
        )
    }
}

export default TimeUnitSelector
