// @flow

import React from 'react'

import FormControl, { type FormControlProps, type InputProps } from '../FormControl'
import Select, { type Props as SelectProps } from './Select'

import styles from './Select/selectInput.pcss'

type Props = FormControlProps & SelectProps

type InnerProps = InputProps

class SelectInput extends React.Component<Props> {
    static Input = Select

    render() {
        const { label, ...props } = this.props
        return (
            <FormControl
                noUnderline
                preserveLabelSpace
                preserveLabelPosition
                {...props}
                label={label}
            >
                {({ value, onFocusChange, setAutoCompleted, ...rest }: InnerProps) => {
                    // Make Flow understand that select props are in `rest`
                    const castProps: SelectProps = ((rest: any): SelectProps)

                    return (
                        <Select
                            className={styles.paddedSelect}
                            value={value}
                            onBlur={onFocusChange}
                            onFocus={onFocusChange}
                            {...castProps}
                        />
                    )
                }}
            </FormControl>
        )
    }
}

export default SelectInput
