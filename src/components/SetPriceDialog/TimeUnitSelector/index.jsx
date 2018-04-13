// @flow

import React from 'react'

import { timeUnits } from '../../../utils/constants'
import type { TimeUnit } from '../../../flowtype/common-types'
import TimeUnitButton from '../TimeUnitButton'

import styles from './timeUnitSelector.pcss'

type Props = {
    selected: TimeUnit,
    onChange: (TimeUnit) => void,
}

const TimeUnitSelector = ({ selected, onChange }: Props) => (
    <div className={styles.timeUnits}>
        {Object.keys(timeUnits).map((timeUnit) => (
            <TimeUnitButton
                key={timeUnit}
                active={timeUnit === selected}
                value={timeUnit}
                onClick={onChange}
                className={styles.timeUnit}
            />
        ))}
    </div>
)

export default TimeUnitSelector
