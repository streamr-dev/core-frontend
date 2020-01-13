// @flow

import React from 'react'
import cx from 'classnames'
import FormControl, { type FormControlProps } from '$shared/components/FormControl'
import { Text } from '$shared/components/Input'
import styles from './TextInput.pcss'

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
                <Text
                    {...rest}
                    className={cx(styles.root, className)}
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
