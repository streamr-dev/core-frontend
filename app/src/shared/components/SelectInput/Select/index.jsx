// @flow

import React from 'react'
import Select, { components } from 'react-select'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'
import styles from './selectInput.pcss'

export type Option = {
    value: any,
    label: string,
}

export type Props = {
    placeholder?: string,
    options: Array<Option>,
    value: any,
    name?: string,
    onChange?: Function,
    required?: boolean,
    clearable?: boolean,
    isDisabled?: boolean,
    className?: string,
    controlClassName?: string,
}

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        padding: '0',
        '&:hover': {
            path: {
                stroke: '#A3A3A3',
            },
        },
        border: state.isFocused ? '1px solid #0324FF' : '1px solid #EFEFEF',
        borderRadius: '4px',
        height: '40px',
        boxShadow: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        letterSpacing: '0',
        lineHeight: '2rem',
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
        zIndex: '10',
    }),
    menuList: (provided) => ({
        ...provided,
        margin: '0.2rem 0',
        padding: '0',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: '0 1rem',
        paddingLeft: '2rem',
        color: '#323232',
        position: 'relative',
        backgroundColor: state.isSelected || state.isFocused ? '#f8f8f8' : null,
        '&:active': {
            backgroundColor: '#f8f8f8',
        },
        lineHeight: '2rem',
    }),
    placeholder: () => ({
        color: '#CDCDCD',
        lineHeight: '1rem',
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 1rem',
        color: '#323232',
        lineHeight: '1rem',
    }),
}

const Control = ({ className, ...props }) => {
    const { controlClassName } = props.selectProps

    return (
        <components.Control {...props} className={cx(className, controlClassName)} />
    )
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
            <SvgIcon name={props.selectProps.menuIsOpen ? 'caretUp' : 'caretDown'} className={styles.caret} />
        </components.DropdownIndicator>
    )
)

const SelectInput = ({ className, controlClassName, ...props }: Props) => (
    <Select
        className={cx(styles.select, className)}
        styles={customStyles}
        components={{
            Control,
            IndicatorSeparator: null,
            Option: IconOption,
            DropdownIndicator,
        }}
        controlClassName={controlClassName}
        {...props}
    />
)

SelectInput.defaultProps = {
    required: false,
    clearable: true,
}

export default SelectInput
