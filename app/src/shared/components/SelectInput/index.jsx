// @flow

import React from 'react'
import Select, { components } from 'react-select'

import FormControl, { type FormControlProps } from '../FormControl'

import styles from './selectInput.pcss'

type Props = FormControlProps & {
    placeholder?: string,
    options: Array<any>,
    value: any,
    name: string,
    onChange: Function,
    required: boolean,
    clearable: boolean,
}

const customStyles = {
    control: (provided) => ({
        ...provided,
        fontSize: '14px',
        padding: '0',
        '&:hover': {
            border: '0',
        },
        border: '0',
        boxShadow: 'none',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#323232',
    }),
    indicatorSeparator: () => ({}),
    menu: (provided) => ({
        ...provided,
        marginTop: '0.5rem',
        padding: '0',
    }),
    menuList: (provided) => ({
        ...provided,
        margin: '0.2rem 0',
        padding: '0',
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '14px',
        padding: '0.5rem 1rem',
        paddingLeft: '2rem',
        lineHeight: 'normal',
        backgroundColor: state.isSelected ? 'red' : (state.isFocused ? '#f8f8f8' : null), // eslint-disable-line
    }),
    placeholder: () => ({
        lineHeight: 'normal',
    }),
    singleValue: () => ({
        border: '1px solid red',
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0.1rem 1rem',
        lineHeight: 'normal',
    }),
}

const IconOption = (props) => (
    <components.Option {...props}>
        <span>icon</span>
        {props.data.label}
    </components.Option>
)

const SelectInput = ({ label, className, ...props }: Props) => (
    <FormControl
        noUnderline
        preserveLabelSpace
        {...props}
        label={label}
    >
        {({ value, onFocusChange, setAutoCompleted, ...rest }) => (
            <Select
                {...rest}
                className={styles.select}
                styles={customStyles}
                value={value}
                components={{
                    IndicatorSeparator: null,
                    Option: IconOption,
                }}
            />
        )}
    </FormControl>
)

SelectInput.defaultProps = {
    required: false,
    clearable: true,
}

export default SelectInput
