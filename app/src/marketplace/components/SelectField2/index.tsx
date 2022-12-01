import React, { FunctionComponent, useEffect, useState } from 'react'
import ReactSelect, { ClearIndicatorProps, components, DropdownIndicatorProps } from 'react-select'
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
    getClearIndicatorStyles, StyledCloseIcon,
} from './selectField2.styles'

type Option = {label: string, value: string}

type SelectFieldProps = {
    placeholder: string,
    options: Option[],
    onChange: (value: string) => void,
    value?: string,
    disabled?: boolean
    isClearable?: boolean
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
    isClearable = true
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<string>()

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
                Option: StyledOption
            }}
            value={selected ? options.find((option) => option.value === selected): null}
            onChange={(option: Option | null) => handleChange(option)}
            styles={{
                control: (styles, props) => getControlStyles(styles, props.isFocused, isOpen, disabled),
                placeholder: (styles) => getPlaceholderStyles(styles, isOpen, disabled),
                singleValue: (styles) => getSingleValueStyles(styles, isOpen, disabled),
                menu: (styles) => getMenuStyles(styles),
                menuList: (styles) => getMenuListStyles(styles),
                option: (styles, props) => getOptionStyles(styles, props.isSelected),
                clearIndicator: (styles) => getClearIndicatorStyles(styles, isOpen)
            }}
        />
    </>
}

export default SelectField2
