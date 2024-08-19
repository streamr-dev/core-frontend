import React, {
    AnchorHTMLAttributes,
    ComponentProps,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'
import styled, { css } from 'styled-components'
import { Anchor, useBoundingClientRect } from '~/components/Anchor'
import { Tooltip } from '~/components/Tooltip'
import EnterIcon from '~/shared/assets/icons/enter.svg'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS } from '~/shared/utils/styled'

interface PassthroughProps {
    disabled?: boolean
    error?: string
    onChange?(): void
    onSubmit?(value: string): void
    placeholder?: string
    required?: boolean
    submitLabel?: string
    title?: string
    value?: string
}

interface PropertyPopoverProps extends PassthroughProps {
    onDismiss?(): void
    open?: boolean
    x: number
    y: number
}

interface PropertyDropdownProps extends PassthroughProps {
    onDismiss?(): void
    valuePlaceholder?: string
    toggleIcon?: ReactNode
}

export function PropertyDropdown({
    onDismiss,
    toggleIcon = <></>,
    value = '',
    valuePlaceholder = '',
    ...props
}: PropertyDropdownProps) {
    const [open, setOpen] = useState(false)

    const displayValue = valuePlaceholder ? value || valuePlaceholder : null

    const content = (
        <Toggle
            type="button"
            onClick={() => {
                setOpen(true)

                onDismiss?.()
            }}
            $active={open}
        >
            <IconWrap>{toggleIcon}</IconWrap>
            {displayValue && <Value $unset={!value}>{displayValue}</Value>}
        </Toggle>
    )

    return (
        <Anchor
            component={PropertyPopover}
            componentProps={{
                ...props,
                onDismiss: () => {
                    setOpen(false)
                },
                open,
                value,
            }}
            translate={(r) => (r ? [r.x, r.y + r.height + window.scrollY] : [0, 0])}
        >
            {value && !valuePlaceholder ? (
                <Tooltip content={value}>{content}</Tooltip>
            ) : (
                content
            )}
        </Anchor>
    )
}

function PropertyPopover(props: PropertyPopoverProps) {
    const {
        disabled = false,
        error = '',
        onChange,
        onDismiss,
        onSubmit,
        open = false,
        placeholder,
        required = false,
        submitLabel = 'Submit',
        title = 'Property',
        value: valueProp = '',
        x,
        y,
    } = props

    const [value, setValue] = useState(valueProp)

    useEffect(
        function syncValueWithUpstream() {
            setValue(valueProp)
        },
        [valueProp, open],
    )

    const bodyRef = useRef<HTMLFormElement>(null)

    const onDismissRef = useRef(onDismiss)

    if (onDismissRef.current !== onDismiss) {
        onDismissRef.current = onDismiss
    }

    useEffect(() => {
        if (!open) {
            return () => {}
        }

        function onMouseDown(e: MouseEvent) {
            if (!(e.target instanceof Element)) {
                return
            }

            if (bodyRef.current?.contains(e.target) === true) {
                return
            }

            onDismissRef.current?.()
        }

        window.addEventListener('mousedown', onMouseDown)

        return () => {
            window.removeEventListener('mousedown', onMouseDown)
        }
    }, [open])

    const dx = useBoundingClientRect(bodyRef, (r) => {
        if (!r || !open) {
            return 0
        }

        return Math.min(0, document.documentElement.clientWidth - (x + r.width + 8))
    })

    return (
        open && (
            <PropertyPopoverRoot
                style={{
                    '--propertyDropdownX': `${x | 0}px`,
                    '--propertyDropdownY': `${y | 0}px`,
                }}
            >
                <PropertyPopoverBody
                    onSubmit={(e) => {
                        e.preventDefault()

                        e.stopPropagation()

                        try {
                            onSubmit?.(value)
                        } catch (e) {
                            /**
                             * If `onSubmit` explodes we don't dismiss the dropdown. Devs can
                             * do whatever they want with it. It's a feature. ;)
                             */

                            console.warn('Failed to submit property value', e)

                            return
                        }

                        onDismiss?.()
                    }}
                    ref={bodyRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            onDismiss?.()

                            e.stopPropagation()
                        }
                    }}
                    style={{
                        '--propertyDropdownDeltaX': `${dx}px`,
                    }}
                >
                    <Header>
                        <Title>{title}</Title>
                        {!required && <Optional>Optional</Optional>}
                    </Header>
                    <InputWrap>
                        <Input
                            disabled={disabled}
                            autoFocus
                            placeholder={placeholder}
                            type="text"
                            value={value}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape' && value !== valueProp) {
                                    setValue(valueProp)

                                    onChange?.()

                                    e.stopPropagation()
                                }
                            }}
                            onChange={(e) => {
                                setValue(e.target.value)

                                onChange?.()
                            }}
                        />
                        <EnterButton
                            type="submit"
                            $visible={!!value || !required}
                            disabled={disabled}
                        >
                            <img src={EnterIcon} />
                        </EnterButton>
                    </InputWrap>
                    {error ? (
                        <ValidationError>{error}</ValidationError>
                    ) : (
                        <Submit type="submit" disabled={disabled}>
                            <PlusIcon />
                            {submitLabel}
                        </Submit>
                    )}
                </PropertyPopoverBody>
            </PropertyPopoverRoot>
        )
    )
}

const PropertyPopoverRoot = styled.div`
    --propertyDropdownX: 0;
    --propertyDropdownY: 0;

    height: 0;
    left: 0;
    position: absolute;
    top: 0;
    transform: translate(var(--propertyDropdownX), var(--propertyDropdownY))
        translateY(8px);
    width: 0;
    z-index: 12;
`

const PropertyPopoverBody = styled.form`
    --propertyDropdownDeltaX: 0;

    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.25),
        0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 16px;
    transform: translateX(var(--propertyDropdownDeltaX));
    width: 320px;
`

const Header = styled.div`
    align-items: center;
    display: flex;
    line-height: 16px;
    margin-bottom: 12px;
`

const Optional = styled.div`
    color: ${COLORS.primaryDisabled};
    font-size: 12px;
`

const Title = styled.h4`
    flex-grow: 1;
    font-size: 14px;
    font-weight: 400;
    margin: 0;
`

const Input = styled.input<{ $invalid?: boolean }>`
    appearance: none;
    border: 1px solid ${COLORS.secondaryHover};
    border-radius: 4px;
    color: inherit;
    font-size: 14px;
    line-height: 30px;
    outline: 0;
    padding: 8px 12px;
    padding-right: 35px;
    transition: 0.35s border-color;
    width: 100%;

    :placeholder-shown {
        padding-right: 0;
    }

    ::placeholder {
        color: ${COLORS.disabled};
    }

    :focus {
        border-color: ${COLORS.focus};
    }

    ${({ $invalid = false }) =>
        $invalid &&
        css`
            outline-color: ${COLORS.error} !important;
        `}
`

const InputWrap = styled.div`
    position: relative;
`

const EnterButton = styled.button<{ $visible?: boolean }>`
    appearance: none;
    background: none;
    border: 0;
    opacity: 0;
    padding: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateX(-12px) translateY(-50%);
    transition: 0.5s ease-out;
    transition-delay: 0.5s, 0s;
    transition-property: visibility, opacity;
    visibility: hidden;

    img {
        display: block;
    }

    ${({ $visible = false }) =>
        $visible &&
        css`
            opacity: 1;
            pointer-events: auto;
            transition-delay: 0s;
            transition-duration: 0.1s;
            transition-timing-function: ease-in;
            visibility: visible;
        `}
`

function getPlusIconAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'plusSmall',
    }
}

const PlusIcon = styled(SvgIcon).attrs(getPlusIconAttrs)`
    display: block;
    height: 10px;
    margin-right: 5px;
    width: 10px;
`

const Submit = styled.button`
    align-items: center;
    appearance: none;
    background-color: ${COLORS.secondaryLight};
    border: 0;
    border-radius: 4px;
    color: inherit;
    display: flex;
    font-size: 12px;
    height: 40px;
    margin-top: 8px;
    padding: 0 10px;
    width: 100%;
`

const ValidationError = styled.div`
    align-items: center;
    color: ${COLORS.error};
    display: flex;
    font-size: 12px;
    line-height: 1.5em;
    margin-top: 8px;
    min-height: 40px;
    padding: 11px 0;
`

const IconWrap = styled.div`
    flex-shrink: 0;
    height: 16px;
    width: 16px;

    > svg {
        display: block;
        height: 100%;
        width: 100%;
    }

    &:empty {
        background: currentColor;
        border-radius: 50%;
    }
`

const Toggle = styled.button<{ $active?: boolean; $dark?: boolean }>`
    align-items: center;
    appearance: none;
    background-color: #ffffff;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15);
    display: flex;
    border: 0;
    border-radius: 4px;
    height: 32px;
    max-width: 100%;
    min-width: 32px;
    padding: 0 8px;
    transition: 0.5s background-color;

    &:hover {
        background-color: ${COLORS.secondaryLight};
        transition-duration: 0.1s;
    }

    a& {
        color: inherit !important;
    }

    ${({ $dark: dark = false }) =>
        dark &&
        css`
            box-shadow: none;
            background-color: #1c1c1c;

            &:hover {
                background-color: #1c1c1c;
            }

            ${IconWrap} {
                color: ${COLORS.Text};
            }
        `}

    ${({ $active = false }) =>
        $active &&
        css`
            background-color: ${COLORS.secondaryLight};
        `}
`

const Value = styled.div<{ $unset?: boolean }>`
    color: ${({ $unset = false }) => ($unset ? '#a3a3a3' : void 0)};
    font-size: 14px;
    line-height: normal;
    margin-left: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const PropertyDropdownList = styled.ul`
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(
        ${({ children }) => React.Children.toArray(children).filter(Boolean).length},
        auto
    );
    justify-content: start;
    list-style: none;
    margin: 0;
    padding: 0;

    > li {
        min-width: 0;
    }
`

interface PropertyDisplayProps {
    dark?: boolean
    displayValue?: string
    href: string
    icon?: ReactNode
}

export function PropertyDisplay(props: PropertyDisplayProps) {
    const { icon = <></>, href = '#', displayValue, dark = false } = props

    const toggleProps: Pick<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        'target' | 'rel'
    > = /^mailto:/.test(href)
        ? {}
        : {
              rel: 'noopener noreferrer',
              target: '_blank',
          }

    return (
        <Toggle
            {...toggleProps}
            as="a"
            href={href}
            onClick={(e) => {
                if (href === '#') {
                    e.preventDefault()
                }
            }}
            $dark={dark}
        >
            <IconWrap>{icon}</IconWrap>
            {displayValue && <Value>{displayValue}</Value>}
        </Toggle>
    )
}

export const PropertyIcon = styled(SvgIcon)<{ $color?: string }>`
    color: ${({ $color = 'currentColor' }) => $color};
    transition: 350ms color;
`
