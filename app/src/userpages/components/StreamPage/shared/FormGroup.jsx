import React from 'react'
import styled, { css } from 'styled-components'
import Label from '$ui/Label'
import UnstyledText from '$ui/Text'
import { SM, XL } from '$shared/utils/styled'

export const Text = styled(UnstyledText)`
    &[disabled] {
        background-color: #efefef;
        color: #525252;
        opacity: 1;
    }

    ${({ centered }) => !!centered && css`
        text-align: center;
    `}
`

const UnstyledField = ({
    label,
    children,
    narrow,
    desktopOnly,
    ...props
}) => (
    <div {...props}>
        <Label>{label}</Label>
        {children}
    </div>
)

export const Field = styled(UnstyledField)`
    flex-grow: 1;

    & + & {
        margin-top: 24px;
    }

    ${({ narrow }) => !!narrow && css`
        flex-grow: 0;
        width: 128px;
    `}

    @media (min-width: ${SM}px) {
        & + & {
            margin: 0 0 0 16px;
        }
    }

    ${({ desktopOnly }) => !!desktopOnly && css`
        display: none;

        @media (min-width: ${XL}px) {
            display: block;
        }
    `}
`

export const FormGroup = styled.div`
    & + & {
        margin-top: 32px;
    }

    @media (min-width: ${SM}px) {
        display: flex;
        justify-content: space-between;
    }

    ${Text} {
        width: 100%;
    }
`

export const StreamIdFormGroup = styled(FormGroup)`
    & + ${FormGroup} {
        margin-top: 32px;
    }

    ${({ hasDomain }) => !!hasDomain && css`
        && {
            ${Field}:nth-child(2) {
                width: auto;
                line-height: 38px;
                display: none;
            }

            @media (min-width: ${SM}px) {
                ${Field}:first-child {
                    max-width: 176px;
                }

                ${Field}:nth-child(2) {
                    display: block;
                }
            }
        }
    `}

    && {
        ${Field}:last-child {
            width: 128px;

            label {
                height: 0;
            }

            button {
                padding: 0;
                width: 100%;
            }
        }

        @media (min-width: ${SM}px) {
            ${Field}:last-child {
                label {
                    height: auto;
                }
            }
        }

    }
`
