// @flow

import React, { useState, useCallback, useEffect } from 'react'
import ColorPicker from '$editor/shared/components/ColorPicker'
import { type CommonProps } from '..'

type Props = CommonProps

const Color = ({ disabled, onChange: onChangeProp, value: valueProp, ...props }: Props) => {
    const [value, setValue] = useState(valueProp)

    const onChange = useCallback((value) => {
        setValue(value)
    }, [])

    const onPickerClose = useCallback(() => {
        // Commit changes when the picker closes. Intermediate changes
        // are stored in the local state.
        onChangeProp(value)
    }, [onChangeProp, value])

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    return (
        <ColorPicker
            {...props}
            disabled={disabled}
            onChange={onChange}
            onClose={onPickerClose}
            value={value}
        />
    )
}

export default Color
