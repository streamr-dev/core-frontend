// @flow

import React from 'react'
import Select, { components } from 'react-select'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'
import styles from './selectInput.pcss'

export type Props = {
    placeholder?: string,
    options: Array<any>,
    value: any,
    name?: string,
    onChange?: Function,
    required?: boolean,
    clearable?: boolean,
    isDisabled?: boolean,
    className?: string,
}

const customStyles = {
    control: (provided) => ({
        ...provided,
        fontSize: '14px',
        padding: '0',
        '&:hover': {
            path: {
                stroke: '#A3A3A3',
            },
        },
        border: '0',
        boxShadow: 'none',
        cursor: 'pointer',
        minHeight: '32px',
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
        color: '#323232',
        position: 'relative',
        backgroundColor: state.isSelected || state.isFocused ? '#f8f8f8' : null,
        '&:active': {
            backgroundColor: '#f8f8f8',
        },
    }),
    placeholder: () => ({
        lineHeight: 'normal',
        color: '#CDCDCD',
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0.1rem 1rem',
        lineHeight: 'normal',
        color: '#323232',
    }),
}

const IconOption = (props) => (
    <components.Option {...props}>
        {props.isSelected && (
            <SvgIcon name="tick" className={styles.tick} />
        )}
        {props.data.label}
    </components.Option>
)

const DropdownIndicator = (props) => (
    components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
            <SvgIcon name="caretDown" className={styles.caret} />
        </components.DropdownIndicator>
    )
)

const SelectInput = ({ className, ...props }: Props) => (
    <Select
        className={cx(styles.select, className)}
        styles={customStyles}
        components={{
            IndicatorSeparator: null,
            Option: IconOption,
            DropdownIndicator,
        }}
        {...props}
    />
)

SelectInput.defaultProps = {
    required: false,
    clearable: true,
}

export default SelectInput
