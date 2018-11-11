// @flow

import React from 'react'

import FormControl, { type FormControlProps } from '../FormControl'
import TextField from '../TextField'

type Props = FormControlProps & {}

const TextInput = ({ label, ...props }: Props) => (
    <FormControl
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
