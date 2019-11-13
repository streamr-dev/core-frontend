// @flow

import React from 'react'

import FormControl, { type FormControlProps } from '$shared/components/FormControl'
import TextField from '../TextField'

type Props = FormControlProps & {
}

const TextInput = ({ label, className, passwordStrengthUpdate, ...props }: Props) => (
    <FormControl
        passwordStrengthUpdate={passwordStrengthUpdate}
        {...props}
        label={label}
    >
        {({ value, onFocusChange, setAutoCompleted, ...rest }) => (
            <TextField
                value={value}
                onBlur={onFocusChange}
                onFocus={onFocusChange}
                onAutoComplete={setAutoCompleted}
                {...rest}
            />
        )}
    </FormControl>
)

export default TextInput
