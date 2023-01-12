import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import ReactSelect, { ClearIndicatorProps, components, DropdownIndicatorProps } from 'react-select'
import { StylesConfig } from 'react-select/dist/declarations/src/styles'
import {
    StyledCaretIcon,
    StyledDropdownIndicator,
    StyledOption,
    getControlStyles,
    getMenuListStyles,
    getMenuStyles,
    getOptionStyles,
    getPlaceholderStyles,
    getSingleValueStyles,
    getClearIndicatorStyles,
    StyledCloseIcon,
    getWhiteControlStyles,
    getWhitePlaceholderStyles,
    getWhiteMenuStyles,
    getWhiteMenuListStyles,
    getWhiteOptionStyles,
    StyledWhiteDropdownOption,
} from './selectField2.styles'

type Option = {label: string, value: string}

type SelectFieldProps = {
    placeholder: string,
    options: Option[],
    onChange: (value: string) => void,
    value?: string,
    disabled?: boolean
    isClearable?: boolean
    whiteVariant?: boolean
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return components.DropdownIndicator && (
        <StyledDropdownIndicator {...props}>
            <StyledCaretIcon
                name="caretDown"
                className={
                    (props.selectProps.menuIsOpen ? 'rotated' : '') +
                    (props.selectProps.isDisabled ? 'disabled' : '')}
            />
        </StyledDropdownIndicator>
    )
}

const ClearIndicator = (props: ClearIndicatorProps) => {
    return components.ClearIndicator && (
        <components.ClearIndicator {...props}>
            <StyledCloseIcon name={'close'} className={props.selectProps.menuIsOpen ? 'menu-is-open' : ''}/>
        </components.ClearIndicator>
    )
}

const SelectField2: FunctionComponent<SelectFieldProps> = ({
    placeholder,
    options,
    value,
    onChange,
    disabled,
    isClearable = true,
    whiteVariant = false
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<string>()

    const defaultStyles = useMemo(() => ({
        control: (styles, props) => getControlStyles(styles, props.isFocused, isOpen, disabled),
        placeholder: (styles) => getPlaceholderStyles(styles, isOpen, disabled),
        singleValue: (styles) => getSingleValueStyles(styles, isOpen, disabled),
        menu: (styles) => getMenuStyles(styles),
        menuList: (styles) => getMenuListStyles(styles),
        option: (styles, props) => getOptionStyles(styles, props.isSelected),
        clearIndicator: (styles) => getClearIndicatorStyles(styles, isOpen)
    }), [])

    const whiteVariantStyles = useMemo(() => ({
        placeholder: (styles) => getWhitePlaceholderStyles(styles),
        control: (styles, props) => getWhiteControlStyles(styles, props.isFocused, disabled),
        menu: (styles) => getWhiteMenuStyles(styles),
        menuList: (styles) => getWhiteMenuListStyles(styles),
        option: (styles, props) => getWhiteOptionStyles(styles, props.isSelected)
    }), [])

    useEffect(() => {
        setSelected(value)
    }, [value])

    const handleChange = (option: Option): void => {
        if (disabled) {
            return
        }
        setSelected(option?.value)
        onChange(option?.value)
    }

    return <>
        <ReactSelect
            placeholder={placeholder}
            options={options}
            isSearchable={false}
            isClearable={isClearable}
            isDisabled={disabled}
            menuIsOpen={isOpen}
            onMenuOpen={() => {setIsOpen(true)}}
            onMenuClose={() => {setIsOpen(false)}}
            components={{
                DropdownIndicator,
                ClearIndicator,
                IndicatorSeparator: () => (<></>),
                Option: whiteVariant ? StyledWhiteDropdownOption : StyledOption
            }}
            value={selected ? options.find((option) => option.value === selected): null}
            onChange={(option: Option | null) => handleChange(option)}
            styles={whiteVariant ? whiteVariantStyles : defaultStyles}
        />
    </>
}

export default SelectField2
