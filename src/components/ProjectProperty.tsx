import React, { ComponentProps, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { z } from 'zod'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS } from '~/shared/utils/styled'
import EnterIcon from '~/shared/assets/icons/enter.svg'
import { useSetProjectDraftErrors } from '~/stores/projectDraft'

export default function ProjectProperty({
    disabled = false,
    error = '',
    onSubmit,
    placeholder = '',
    required = false,
    submitLabel = 'Submit',
    title = 'Title',
    value: valueProp = '',
}: {
    disabled?: boolean
    error?: string
    onSubmit?: (value: string) => void | Promise<void>
    placeholder?: string
    required?: boolean
    submitLabel?: string
    title?: string
    value?: string
}) {
    const [value, setValue] = useState(valueProp)

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    const setErrors = useSetProjectDraftErrors()

    return (
        <Root
            onSubmit={async (e) => {
                e.preventDefault()

                if (disabled) {
                    return
                }

                try {
                    await onSubmit?.(value)
                } catch (e) {
                    if (e instanceof z.ZodError) {
                        const errors = {}

                        e.issues.forEach(({ path, message }) => {
                            errors[path.join('.')] = message
                        })

                        return void setErrors((existingErrors) => {
                            Object.assign(existingErrors, errors)
                        })
                    }

                    console.warn('Failed to submit a project property', e)
                }
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

                            e.stopPropagation()
                        }
                    }}
                    onChange={(e) => {
                        setValue(e.target.value)
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
        </Root>
    )
}

const Root = styled.form`
    padding: 16px;
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
