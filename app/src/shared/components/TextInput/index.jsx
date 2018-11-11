// @flow

import React from 'react'
import cx from 'classnames'

import FormControl, { type FormControlProps } from '../FormControl'
import TextField from '../TextField'
import styles from './textInput.pcss'

type Props = FormControlProps & {
    className?: string,
    preserveLabelSpace?: boolean,
}

const TextInput = ({ label, className, preserveLabelSpace, ...props }: Props) => (
    <FormControl
        {...props}
        className={cx(className, {
            [styles.withLabelSpace]: !!preserveLabelSpace,
        })}
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
