// @flow

import React, { useCallback, useMemo } from 'react'
import { type CommonProps } from '..'
import styles from './select.pcss'

type Props = CommonProps & {
    options: Array<{
        name: string,
        value: any,
    }>,
}

const Select = ({
    disabled,
    onChange: onChangeProp,
    value,
    options,
    ...props
}: Props) => {
    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        onChangeProp(e.target.value)
    }, [onChangeProp])

    const optionMap = useMemo(() => (
        options.reduce((memo, { name, value }) => ({
            ...memo,
            [value || '']: name,
        }), {})
    ), [options])

    return (
        <div className={styles.root}>
            <div className={styles.inner}>
                <select
                    {...props}
                    className={styles.control}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                >
                    {options.map(({ name, value }) => (
                        <option key={value} value={value}>{name}</option>
                    ))}
                </select>
                {/* `select` holding a currently selected value. This hidden (`visibility: hidden`) control
                    dictates the width of the actual (visible) control above. */}
                <select className={styles.spaceholder}>
                    <option>{optionMap[value]}</option>
                </select>
            </div>
        </div>
    )
}

export default Select
