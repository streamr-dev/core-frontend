// @flow

import React, { useCallback } from 'react'
import { type CommonProps } from '..'

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

    return (
        <select
            {...props}
            value={value}
            disabled={disabled}
            onChange={onChange}
        >
            {options.map(({ name, value }) => (
                <option key={value} value={value}>{name}</option>
            ))}
        </select>
    )
}

export default Select
