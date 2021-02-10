// @flow

import React from 'react'
import styled, { css } from 'styled-components'
import ReactSelect, { components } from 'react-select'
import cx from 'classnames'
import SvgIcon from '$shared/components/SvgIcon'

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
    disabled?: boolean,
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
        backgroundColor: state.isDisabled ? '#EFEFEF' : provided.backgroundColor,
        opacity: state.isDisabled ? 0.5 : 1,
        backfaceVisibility: 'hidden',
        color: state.isDisabled ? '#32323280' : '#323232',
        border: state.isFocused ? '1px solid #0324FF' : '1px solid #EFEFEF',
        borderRadius: '4px',
        height: '40px',
        boxShadow: 'none',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        pointerEvents: 'auto',
        fontSize: '1rem',
        letterSpacing: '0',
        lineHeight: '2rem',
        width: '100%',
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.isDisabled ? '#32323280' : '#323232',
        marginRight: '8px',
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
        textAlign: 'left',
        padding: '0 1rem',
        paddingLeft: '1rem',
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
    singleValue: (provided) => ({
        ...provided,
        margin: 0,
        overflow: 'visible',
    }),
}

const Control = ({ className, ...props }) => {
    const { controlClassName } = props.selectProps

    return (
        <components.Control {...props} className={cx(className, controlClassName)} />
    )
}

const UnstyledTick = (props: any) => (
    <SvgIcon {...props} name="tick" />
)

const Tick = styled(UnstyledTick)`
    height: 8px;
    right: 12px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
`

const IconOption = (props) => (
    <components.Option {...props}>
        {props.isSelected && <Tick />}
        {props.data.label}
    </components.Option>
)

const Caret = styled(SvgIcon)`
    height: 8px;
    width: 10px;
    transition: transform 180ms ease-in-out;
`

const DropdownIndicator = (props) => (
    components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
            <Caret
                name="caretDown"
                css={props.selectProps.menuIsOpen ? css`
                    transform: rotate(180deg);
                ` : undefined}
            />
        </components.DropdownIndicator>
    )
)

const UnstyledSelect = ({
    controlClassName,
    required = false,
    clearable = true,
    disabled,
    ...props
}: Props) => (
    <ReactSelect
        styles={customStyles}
        components={{
            Control,
            IndicatorSeparator: null,
            Option: IconOption,
            DropdownIndicator,
        }}
        controlClassName={controlClassName}
        required={required}
        clearable={clearable}
        isDisabled={disabled}
        isSearchable={false}
        // $FlowFixMe potential override necessary.
        {...props}
    />
)

const Select = styled(UnstyledSelect)`
    font-size: 0.875rem;
`

export default Select
