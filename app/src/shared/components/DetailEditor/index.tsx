import React, { ChangeEvent, FunctionComponent, ReactNode, useEffect, useMemo, useState } from 'react'
import ReactSelect from 'react-select'
import { DropdownMenu, DropdownToggle } from 'reactstrap'
import SvgIcon from '$shared/components/SvgIcon'
import {
    DetailEditorDropdown,
    StyledDetailEditorDropdownOption,
    getDetailEditorDropdownControlStyles,
    getDetailEditorDropdownMenuListStyles,
    getDetailEditorDropdownMenuStyles,
    getDetailEditorDropdownPlaceholderStyles, getDetailEditorDropdownOptionStyles
} from './detailEditor.styles'
import EnterIcon from './enter.svg'

export type DetailEditorSelectOption = {
    label: ReactNode,
    value: any
}

type DetailsEditorProps = {
    defaultIcon?: ReactNode,
    unsetValueText?: string,
    hasValueIcon?: ReactNode,
    value?: any,
    showValue?: boolean,
    showValueFormatter?: (value: any) => string,
    optional?: boolean,
    selectOptions?: DetailEditorSelectOption[],
    instructionText: string,
    ctaButtonText?: string,
    placeholder?: string,
    validation?: {validator: (value: any) => boolean, message: string}[]
    onChange: (value: any) => void,
    className?: string
    disabled?: boolean
}

export const DetailEditor: FunctionComponent<DetailsEditorProps> = ({
    defaultIcon,
    unsetValueText,
    hasValueIcon,
    value,
    showValue = false,
    showValueFormatter,
    optional = false,
    selectOptions,
    instructionText,
    ctaButtonText,
    placeholder,
    validation,
    onChange,
    className,
    disabled
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>()
    const [validationError, setValidationError] = useState<string>()
    const [inputTouched, setInputTouched] = useState<boolean>(false)
    const [inputIsFocused, setInputIsFocused] = useState<boolean>()

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        setInputValue(value)
    }, [value])

    useEffect(() => {
        if (!optional && !inputValue && inputTouched ) {
            return setValidationError('This field is required')
        }
        if (!!inputValue && validation) {
            validation.forEach((validationSchema) => {
                if (!validationSchema.validator(inputValue)) {
                    setValidationError(validationSchema.message)
                } else {
                    setValidationError('')
                }
            })
        }
        if (!inputValue) {
            setValidationError('')
        }
    }, [inputValue, inputTouched])

    const handleSubmit = () => {
        if (!validationError) {
            onChange(inputValue)
            setIsOpen(false)
        }
    }

    const handleSelection = (value: any) => {
        onChange(value)
        setInputValue(value)
        setIsOpen(false)
        return
    }

    const handleClear = () => {
        setInputValue('')
        onChange('')
        setIsOpen(false)
    }

    const valueToDisplay = useMemo<string>(() => {
        if (!value) {
            return unsetValueText
        }
        if (showValueFormatter) {
            return showValueFormatter(value)
        }
        return value
    }, [value, unsetValueText, showValueFormatter])

    return <DetailEditorDropdown isOpen={isOpen} toggle={handleToggle} className={className}>
        <DropdownToggle disabled={disabled}>
            {value ? (hasValueIcon || defaultIcon) : defaultIcon}
            {showValue &&
                <span
                    className={"value" + (!value ? ' value-unset' : '') + (defaultIcon || hasValueIcon ? ' has-icon' : '')}>
                    {valueToDisplay}
                </span>
            }
        </DropdownToggle>
        <DropdownMenu>
            <div className={'header'}>
                <span className={'instruction'}>{instructionText}</span>
                <span className={'optional'}>{optional && 'Optional'}</span>
            </div>
            {!selectOptions && <div>
                <form className={'text-input-container'} onSubmit={(event) => {
                    event.preventDefault()
                    handleSubmit()
                }}>
                    <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)}
                        onFocus={() => {
                            setInputTouched(true)
                            setInputIsFocused(true)
                        }}
                        onBlur={() => setInputIsFocused(false)}
                        placeholder={placeholder}
                        className={'text-input ' + (validationError ? 'invalid-input' : '')}
                        defaultValue={inputValue}
                    />
                    <img
                        src={EnterIcon}
                        className={'enter-icon ' + (inputIsFocused && inputValue ? 'visible' : '')}
                        onClick={handleSubmit}
                    />
                </form>
                {
                    !validationError && !inputValue && !!value &&
                    <button className={'detail-input-cta'} type={'button'} onClick={handleClear}>
                        <SvgIcon name={'close'} className={'cta-icon'}/>
                        <span>Remove {ctaButtonText}</span>
                    </button>
                }
                {
                    !validationError && !(!inputValue && !!value) &&
                    <button className={'detail-input-cta'}
                        type={'button'}
                        onClick={handleSubmit}
                        disabled={!inputValue}>
                        <SvgIcon name={'plusSmall'} className={'cta-icon'}/>
                        <span>Add {ctaButtonText}</span>
                    </button>
                }
                {
                    validationError && <span className={'validation-error'}>{validationError}</span>
                }
            </div>}
            {selectOptions &&
                <ReactSelect
                    options={selectOptions}
                    placeholder={placeholder}
                    isSearchable={false}
                    isClearable={false}
                    defaultValue={value ? selectOptions.find((option) => option.value === value) : null}
                    components={{
                        IndicatorSeparator: () => <></>,
                        Option: StyledDetailEditorDropdownOption
                    }}
                    onChange={(element: DetailEditorSelectOption) => {
                        handleSelection(element.value)
                    }}
                    styles={{
                        placeholder: (styles) => getDetailEditorDropdownPlaceholderStyles(styles),
                        control: (styles, props) => getDetailEditorDropdownControlStyles(styles, props.isFocused),
                        menu: (styles) => getDetailEditorDropdownMenuStyles(styles),
                        menuList: (styles) => getDetailEditorDropdownMenuListStyles(styles),
                        option: (styles, props) => getDetailEditorDropdownOptionStyles(styles, props.isSelected)
                    }}
                />
            }
        </DropdownMenu>
    </DetailEditorDropdown>
}

