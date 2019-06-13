// @flow

import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'
import SvgIcon from '$shared/components/SvgIcon'
import AutosizedSelect from '$shared/components/AutosizedSelect'
import styles from './rangeSelect.pcss'

const ranges = [
    // All
    'all',
    // 1 month
    2592000000,
    // 1 week
    604800000,
    // 1 day
    86400000,
    // 12 hours
    43200000,
    // 8 hours
    28800000,
    // 4 hours
    14400000,
    // 2 hours
    7200000,
    // 1 hour
    3600000,
    // 30 minutes
    1800000,
    // 15 minutes
    900000,
    // 1 minute
    60000,
    // 15 seconds
    15000,
    // 1 second
    1000,
]

type Range = number | 'all'

type Props = {
    className?: ?string,
    onChange?: ?(Range) => void,
    value?: Range,
}

const RangeSelect = ({ className, value, onChange: onChangeProp }: Props) => {
    const onChange = useCallback((value: string) => {
        if (onChangeProp) {
            onChangeProp(value === 'all' ? value : Number.parseInt(value, 10))
        }
    }, [onChangeProp])

    const isCustomRange: boolean = useMemo(() => !!value && !ranges.includes(value), [value])

    return (
        <div className={cx(styles.root, className)}>
            <AutosizedSelect
                className={styles.select}
                onChange={onChange}
                value={value}
            >
                <option disabled value="">
                    Range
                </option>
                {isCustomRange && (
                    <option disabled value={value}>
                        Custom
                    </option>
                )}
                {ranges.map((range) => (
                    <option key={range} value={range}>
                        {/* AutosizedSelect's children have to be strings. */}
                        {I18n.t(`editor.timeRange.${range}`)}
                    </option>
                ))}
            </AutosizedSelect>
            <SvgIcon
                name="caretDown"
                className={styles.caret}
            />
        </div>
    )
}

export default RangeSelect
