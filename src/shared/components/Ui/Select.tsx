import React, { FunctionComponent, ReactElement, ReactNode } from 'react'
import styled from 'styled-components'
import ReactSelect, { SingleValue, components } from 'react-select'
import SvgIcon, { SvgIconProps } from '~/shared/components/SvgIcon'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'

type Option = {
    value: any
    label: string
    icon?: ReactElement
}

interface Props
    extends Omit<
        StateManagerProps<Option, false>,
        | 'className'
        | 'className'
        | 'components'
        | 'isClearable'
        | 'isDisabled'
        | 'isDisabled'
        | 'isMulti'
        | 'isSearchable'
    > {
    clearable?: boolean
    disabled?: boolean
    controlClassName?: string
}

// TODO add typing
const customStyles: any = {
    control: (provided: any, state: any) => ({
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
    dropdownIndicator: (provided: any, state: any) => ({
        ...provided,
        color: state.isDisabled ? '#32323280' : '#323232',
        marginRight: '8px',
    }),
    indicatorSeparator: () => ({}),
    menu: (provided: any) => ({
        ...provided,
        marginTop: '0.5rem',
        padding: '0',
        zIndex: '10',
    }),
    menuList: (provided: any) => ({ ...provided, margin: '0.2rem 0', padding: '0' }),
    option: (provided: any, state: any) => ({
        ...provided,
        display: 'flex',
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
        alignItems: 'center',
    }),
    placeholder: () => ({
        color: '#CDCDCD',
        lineHeight: '1rem',
        position: 'absolute',
        left: '16px',
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: '0 1rem',
        color: '#323232',
        lineHeight: '1rem',
        overflow: 'visible',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        margin: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
    }),
}

const Control: FunctionComponent<{
    className?: string
    children?: ReactNode | ReactNode[]
    selectProps: any
}> = ({ className, children, ...props }) => {
    const { controlClassName } = props.selectProps
    return (
        <components.Control
            {...(props as any)}
            className={`${className || ''} ${controlClassName || ''}`.trim()}
        >
            {children}
        </components.Control>
    )
}

const EllipsisSpan = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const EllipsisSpanWithTickMargin = styled(EllipsisSpan)`
    margin-right: 18px;
`

const UnstyledTick = (props: any) => <SvgIcon {...props} name="tick" />

const Tick = styled(UnstyledTick)`
    height: 8px;
    right: 12px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
`
const OptionIconWrapper = styled.div`
    width: 20px;
    margin-right: 0.5rem;
`

const IconOption: FunctionComponent<{
    isSelected: boolean
    data: Option
}> = (props) => (
    <components.Option {...(props as any)}>
        {props.isSelected && <Tick />}
        {props.data.icon != null && (
            <OptionIconWrapper>{props.data.icon}</OptionIconWrapper>
        )}
        <EllipsisSpanWithTickMargin>{props.data.label}</EllipsisSpanWithTickMargin>
    </components.Option>
)

type CaretProps = {
    $isOpen: boolean // transient prop -> does not forward to SvgIcon
} & SvgIconProps

const Caret = styled(SvgIcon)<CaretProps>`
    height: 8px;
    width: 10px;
    transition: transform 180ms ease-in-out;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : '')};
`

const DropdownIndicator = (props: any) =>
    components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
            <Caret name="caretDown" $isOpen={props.selectProps.menuIsOpen} />
        </components.DropdownIndicator>
    )

const IconWrapper = styled.div`
    width: 24px;
    margin-right: 0.5rem;
`

const SingleValue = ({ children, ...props }) => {
    const { icon } = props.getValue()[0] || {}
    return (
        <components.SingleValue {...(props as any)}>
            {icon != null && <IconWrapper>{icon}</IconWrapper>}
            <EllipsisSpan>{children}</EllipsisSpan>
        </components.SingleValue>
    )
}

const ClearIndicator = () => <></>

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
            SingleValue,
            ClearIndicator,
        }}
        isMulti={false}
        className={controlClassName}
        required={required}
        isClearable={clearable}
        isDisabled={disabled}
        isSearchable={false} // $FlowFixMe potential override necessary.
        {...props}
    />
)

const Select = styled(UnstyledSelect)`
    font-size: 0.875rem;
`
/**
 * @deprecated
 * Replaced by SelectField2 due to redesign of the Hub
 */
export default Select
