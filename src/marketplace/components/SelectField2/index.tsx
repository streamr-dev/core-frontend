import React, { useEffect, useMemo, useState } from 'react'
import ReactSelect, {
    ClearIndicatorProps,
    DropdownIndicatorProps,
    components,
} from 'react-select'
import { z } from 'zod'
import {
    StyledCaretIcon,
    StyledCloseIcon,
    StyledDropdownIndicator,
    StyledOption,
    StyledWhiteDropdownOption,
    getClearIndicatorStyles,
    getControlStyles,
    getMenuListStyles,
    getMenuStyles,
    getOptionStyles,
    getPlaceholderStyles,
    getSingleValueStyles,
    getWhiteControlStyles,
    getWhiteMenuListStyles,
    getWhiteMenuStyles,
    getWhiteOptionStyles,
    getWhitePlaceholderStyles,
} from './selectField2.styles'

type Option = { label: string; value: string }

type SelectFieldProps<T = unknown, R = unknown> = {
    placeholder: string
    options: Option[]
    onChange: (value: R) => void
    value?: string
    disabled?: boolean
    isClearable?: T
    whiteVariant?: boolean
    noShrink?: boolean
    fullWidth?: boolean
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
        <StyledDropdownIndicator {...props}>
            <StyledCaretIcon
                name="caretDown"
                className={
                    (props.selectProps.menuIsOpen ? 'rotated' : '') +
                    (props.selectProps.isDisabled ? 'disabled' : '')
                }
            />
        </StyledDropdownIndicator>
    )
}

const ClearIndicator = (props: ClearIndicatorProps) => {
    return (
        components.ClearIndicator && (
            <components.ClearIndicator {...props}>
                <StyledCloseIcon
                    name={'close'}
                    className={props.selectProps.menuIsOpen ? 'menu-is-open' : ''}
                />
            </components.ClearIndicator>
        )
    )
}

export function SelectField2<
    T extends boolean = true,
    R = T extends true ? string | null : string,
>({
    placeholder,
    options,
    value,
    onChange,
    disabled = false,
    isClearable = true as T,
    whiteVariant = false,
    noShrink = false,
    fullWidth = false,
}: SelectFieldProps<T, R>) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<string>()

    const defaultStyles = useMemo(
        () => ({
            control: (styles, props) =>
                getControlStyles(
                    styles,
                    props.isFocused,
                    isOpen,
                    disabled,
                    noShrink,
                    fullWidth,
                ),
            placeholder: (styles) => getPlaceholderStyles(styles, isOpen, disabled),
            singleValue: (styles) =>
                getSingleValueStyles(styles, isOpen, disabled, noShrink),
            menu: (styles) => getMenuStyles(styles),
            menuList: (styles) => getMenuListStyles(styles),
            option: (styles, props) => getOptionStyles(styles, props.isSelected),
            clearIndicator: (styles) => getClearIndicatorStyles(styles, isOpen),
        }),
        [disabled, fullWidth, isOpen, noShrink],
    )

    const whiteVariantStyles = useMemo(
        () => ({
            placeholder: (styles) => getWhitePlaceholderStyles(styles),
            control: (styles, props) =>
                getWhiteControlStyles(
                    styles,
                    props.isFocused,
                    disabled,
                    noShrink,
                    fullWidth,
                ),
            menu: (styles) => getWhiteMenuStyles(styles),
            menuList: (styles) => getWhiteMenuListStyles(styles),
            option: (styles, props) => getWhiteOptionStyles(styles, props.isSelected),
        }),
        [disabled, fullWidth, noShrink],
    )

    useEffect(() => {
        setSelected(value)
    }, [value])

    const handleChange = (option: unknown): void => {
        if (disabled) {
            return
        }

        if (isClearable && option === null) {
            setSelected(undefined)

            onChange(null as R)
        }
        if (disabled || !isOption(option)) {
            return
        }

        setSelected(option.value)

        onChange(option.value as R)
    }

    return (
        <>
            <ReactSelect
                placeholder={placeholder}
                options={options}
                isSearchable={false}
                isClearable={isClearable}
                isDisabled={disabled}
                menuIsOpen={isOpen}
                onMenuOpen={() => {
                    setIsOpen(true)
                }}
                onMenuClose={() => {
                    setIsOpen(false)
                }}
                components={{
                    DropdownIndicator,
                    ClearIndicator,
                    IndicatorSeparator: () => <></>,
                    Option: whiteVariant ? StyledWhiteDropdownOption : StyledOption,
                }}
                value={
                    selected ? options.find((option) => option.value === selected) : null
                }
                onChange={handleChange}
                styles={whiteVariant ? whiteVariantStyles : defaultStyles}
                menuPortalTarget={document.body}
            />
        </>
    )
}

function isOption(arg: unknown): arg is Option {
    return z.object({ label: z.string(), value: z.string() }).safeParse(arg).success
}
