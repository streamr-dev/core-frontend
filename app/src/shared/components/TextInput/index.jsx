// @flow

import React from 'react'

import FormControl, { type FormControlProps } from '../FormControl'
import TextField from '../TextField'

type Props = FormControlProps & {
    className?: ?string,
    onBlur?: (SyntheticInputEvent<EventTarget>) => void,
    onFocus?: (SyntheticInputEvent<EventTarget>) => void,
}

const TextInput = ({
    label,
    className,
    passwordStrengthUpdate,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    ...props
}: Props) => (
    <FormControl
        {...props}
        passwordStrengthUpdate={passwordStrengthUpdate}
        label={label}
        noUnderline
    >
        {({ value, onFocusChange: onFocusChangeProp, setAutoCompleted, ...rest }) => {
            const onBlur = (...args) => {
                onFocusChangeProp(...args)
                if (onBlurProp) {
                    onBlurProp(...args)
                }
            }

            const onFocus = (...args) => {
                onFocusChangeProp(...args)
                if (onFocusProp) {
                    onFocusProp(...args)
                }
            }

            return (
                // TODO(MR): replace with Input/Text. #newtext
                <TextField
                    {...rest}
                    className={className}
                    value={value}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onAutoComplete={setAutoCompleted}
                />
            )
        }}
    </FormControl>
)

export default TextInput
