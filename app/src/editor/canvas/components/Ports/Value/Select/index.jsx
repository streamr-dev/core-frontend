// @flow

import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { type CommonProps } from '..'
import styles from './select.pcss'

type Options = Array<{
    name: string,
    value: any,
}>

type Props = CommonProps & {
    description?: string,
    options: Options,
}

type SelectOptions = {
    value: any,
    options: Options,
}

export function useSelectOptions({ value, options = [] }: SelectOptions = {}) {
    /* coerce option value to string or undefined */
    const toValue = (value) => (value == null ? undefined : String(value))
    value = toValue(value)
    // $FlowFixMe
    options = options.map(({ name, value }) => ({
        name,
        value: toValue(value),
    }))

    const { name, value: selectedValue } = options.find((opt) => opt.value === value) || {
        // default if matching option not found
        name: value,
        value,
    }

    return useMemo(() => ({
        name,
        value: selectedValue,
        options,
    }), [options, name, selectedValue])
}

const Select = ({
    className,
    disabled,
    onChange: onChangeProp,
    description,
    value,
    title,
    options,
    ...props
}: Props) => {
    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        onChangeProp(e.target.value)
    }, [onChangeProp])

    const selectConfig = useSelectOptions({
        value,
        options,
    })

    const selectOptions = selectConfig.options.map(({ name, value }) => (
        <option key={value + name} value={value}>{name}</option>
    ))

    return (
        <div className={cx(styles.root, className)}>
            <div className={styles.inner}>
                <select
                    {...props}
                    title={title != null ? String(title) : String(value)}
                    className={styles.control}
                    value={selectConfig.value}
                    disabled={disabled}
                    onChange={onChange}
                >
                    {description ? (
                        <optgroup label={description}>
                            {selectOptions}
                        </optgroup>
                    ) : selectOptions}
                </select>
                {/* `select` holding a currently selected value. This hidden (`visibility: hidden`) control
                    dictates the width of the actual (visible) control above. */}
                <select className={styles.spaceholder}>
                    {/* Some inputs like `windowType` come with a default value set by the server
                        to a value that's not on the list of possible values (casing mismatch
                        such as `events` vs `EVENTS`). In that case we simply display the raw
                        value here instead of nothing. */}
                    <option>{selectConfig.name != null ? selectConfig.name : selectConfig.value}</option>
                </select>
            </div>
        </div>
    )
}

export default Select
