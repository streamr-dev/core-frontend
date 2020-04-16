// @flow

import React from 'react'
import ReactSelect, { components } from 'react-select'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './Sidebar.pcss'

export type Props = {
    placeholder?: string,
    disabled?: boolean,
    options: Array<any>,
    value: any,
    name?: string,
    onChange?: Function,
    className?: ?string,
}

const IconOption = (props) => (
    <components.Option {...props}>
        {props.data.label}
        {props.isSelected && (
            <SvgIcon name="tick" className={styles.tick} />
        )}
    </components.Option>
)

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none',
        backgroundColor: state.isDisabled ? 'transparent' : provided.backgroundColor,
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: 0,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ADADAD',
        fontWeight: '400',
        '&:hover': {
            color: '#323232',
            fontWeight: '500',
        },
    }),
    menu: (provided) => ({
        ...provided,
        width: 'auto',
        margin: 0,
        borderRadius: '4px',
        boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.1)',
        left: '-20px',
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '14px',
        padding: '0.5rem 1rem',
        paddingRight: '3rem',
        lineHeight: 'normal',
        color: state.isSelected ? 'white' : '#323232',
        position: 'relative',
        // eslint-disable-next-line no-nested-ternary
        backgroundColor: state.isSelected ? '#0324ff' : state.isFocused ? '#f8f8f8' : null,
        '&:active': {
            backgroundColor: '#f8f8f8',
        },
        whiteSpace: 'nowrap',
    }),
}

const Select = ({ className, disabled, ...props }: Props) => (
    <ReactSelect
        {...props}
        className={className || styles.select}
        classNamePrefix="react-select"
        styles={customStyles}
        isDisabled={disabled}
        components={{
            IndicatorSeparator: null,
            Option: IconOption,
            DropdownIndicator: null,
        }}
        isSearchable={false} // Magic words to make the Select Read Only
        isClearable={false}
        backspaceRemovesValue={false}
    />
)

export default Select
