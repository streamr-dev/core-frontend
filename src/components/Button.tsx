import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import PrestyledSpinner from '~/components/Spinner'

interface Props {
    children: ReactNode
    kind?:
        | 'primary'
        | 'secondary'
        | 'destructive'
        | 'link'
        | 'special'
        | 'primary2'
        | 'transparent'
    size?: 'mini' | 'normal' | 'big'
    outline?: boolean
}

function kindCss({ kind = 'primary', outline = false }: Pick<Props, 'kind' | 'outline'>) {
    switch (kind) {
        case 'primary':
            return css`
                background-color: #0324ff;
                border-color: #0324ff;

                &,
                :link,
                :active,
                :visited {
                    color: #ffffff;
                }

                :hover,
                :focus {
                    background-color: #0d009a;
                    border-color: #0d009a;
                }

                :active {
                    background-color: #09006d;
                    border-color: #09006d;
                }

                &[disabled] {
                    background-color: #0324ff;
                    border-color: #0324ff;
                    color: rgba(255, 255, 255, 0.5);
                }

                ${outline &&
                css`
                    &,
                    &[href] {
                        color: rgb(3, 36, 255, 1);
                        border-color: #0324ff;
                    }

                    :hover,
                    :focus {
                        color: #0d009a;
                        border-color: #0d009a;
                    }

                    :active {
                        color: #09006d;
                        border-color: #09006d;
                    }

                    &[disabled] {
                        color: rgb(3, 36, 255, 0.5);
                        border-color: #0324ff;
                    }
                `}
            `
        case 'secondary':
            return css`
                background-color: #f5f5f5;
                border-color: #f5f5f5;

                &,
                :link,
                :active,
                :visited {
                    color: rgba(82, 82, 82, 1);
                }

                :hover,
                :focus {
                    color: inherit;
                    background-color: #e7e7e7;
                    border-color: #e7e7e7;
                }

                :active {
                    background-color: #d8d8d8;
                    border-color: #d8d8d8;
                }

                &[disabled] {
                    background-color: #f5f5f5;
                    border-color: #f5f5f5;
                    color: rgba(82, 82, 82, 0.5);
                }

                ${outline &&
                css`
                    border-color: #525252;

                    :hover,
                    :focus {
                        border-color: #323232;
                    }

                    :active {
                        border-color: #525252;
                    }

                    &[disabled] {
                        border-color: #efefef;
                    }
                `}
            `
        case 'destructive':
            return css`
                background-color: #ff0f2d;
                border-color: #ff0f2d;

                &,
                :link,
                :active,
                :visited {
                    color: #ffffff;
                }

                :hover,
                :focus {
                    background-color: #ea112c;
                    border-color: #ea112c;
                }

                :active {
                    background-color: #d50f28;
                    border-color: #d50f28;
                }

                &[disabled] {
                    background-color: #ff0f2d;
                    border-color: #ff0f2d;
                    color: rgba(255, 255, 255, 0.5);
                }

                ${outline &&
                css`
                    &,
                    :link,
                    :active,
                    :visited {
                        color: #ff0f2d;
                    }
                `}
            `
        case 'link':
            return css`
                background-color: transparent;
                border-color: transparent;
                font-weight: var(--regular);
                padding: 0 0.5rem !important; /* ignore "size" classes */

                &,
                :link,
                :active,
                :visited {
                    color: #525252;
                }

                :hover,
                :focus {
                    color: #323232;
                    transform: scale(1) translate3d(0, 0, 0);
                }

                :active {
                    color: rgba(82, 82, 82, 0.8);
                    transform: scale(1) translate3d(0, 0, 0);
                }

                &[disabled] {
                    border-color: transparent;
                    color: rgba(82, 82, 82, 0.5);
                }
            `
        case 'special':
            return css`
                background-color: rgba(255, 255, 255, 0.9);
                border-color: rgba(255, 255, 255, 0.9);
                border-radius: 20px;
                font: var(--sans);
                font-size: 12px !important; /* ignore "size" classes */
                font-weight: var(--medium);
                height: 40px !important; /* ignore "size" classes */
                letter-spacing: 1px;
                line-height: 12px !important; /* ignore "size" classes */
                padding: 0 1.5rem !important; /* ignore "size" classes */
                text-transform: uppercase;

                &,
                :link,
                :active,
                :visited {
                    color: rgba(50, 50, 50, 1);
                }

                :hover,
                :focus {
                    color: inherit;
                    background-color: rgba(255, 255, 255, 1);
                    border-color: rgba(255, 255, 255, 1);
                }

                :active {
                    background-color: rgba(255, 255, 255, 0.8);
                    border-color: rgba(255, 255, 255, 0.8);
                }

                &[disabled] {
                    background-color: rgba(255, 255, 255, 0.9);
                    border-color: rgba(255, 255, 255, 0.9);
                    color: rgba(50, 50, 50, 0.5);
                }
            `
        case 'primary2':
            return css`
                background-color: #323232;
                border-color: #323232;

                &,
                :link,
                :active,
                :visited {
                    color: #ffffff;
                }

                :hover,
                :focus {
                    background-color: #525252;
                    border-color: #525252;
                }

                :active {
                    background-color: #525252;
                    border-color: #525252;
                }

                &[disabled] {
                    background-color: #323232;
                    border-color: #323232;
                    color: #a3a3a3;
                }
            `
        case 'transparent':
            return css`
                background-color: transparent;
                border-color: transparent;

                &,
                :link,
                :active,
                :visited {
                    color: #525252;
                }

                &:hover,
                &:focus {
                    background-color: transparent;
                    border-color: transparent;
                }

                :active {
                    background-color: transparent;
                    border-color: transparent;
                }

                &[disabled] {
                    background-color: transparent;
                    border-color: transparent;
                    color: rgba(82, 82, 82, 0.5);
                }
            `
        default:
            return null
    }
}

function sizeCss({ size = 'normal' }: Pick<Props, 'size'>) {
    switch (size) {
        case 'mini':
            return css`
                height: 32px;
                padding: 0 0.5rem;
                font-size: 14px;
                line-height: 16px;
            `
        case 'normal':
            return css`
                height: 40px;
                padding: 0 1rem;
                font-size: 14px;
                line-height: 22px;
            `
        case 'big':
            return css`
                height: 48px;
                padding: 0 2rem;
                font-size: 16px;
                line-height: 24px;
            `
        default:
            return null
    }
}

function outlineCss({ outline }: Pick<Props, 'outline'>) {
    if (outline) {
        return css`
            background-color: transparent !important;
        `
    }
}

function getButtonAttrs({
    children,
    waiting = false,
    outline = false,
    disabled = false,
    onClick,
    kind = 'primary',
    ...props
}: any) {
    return {
        ...props,
        disabled: disabled || waiting,
        children: (
            <>
                {children}
                {waiting && (
                    <Spinner
                        color={
                            !outline && (kind === 'primary' || kind === 'destructive')
                                ? 'white'
                                : 'gray'
                        }
                    />
                )}
            </>
        ),
        tabIndex: disabled ? -1 : 0,
        onClick: (e: any) => {
            if (disabled) {
                e.preventDefault()

                return
            }

            if (e.currentTarget instanceof HTMLElement) {
                // Make sure we make the button lose focus after click
                e.currentTarget.blur()
            }

            onClick?.(e)
        },
    }
}

export const Button = styled.button.attrs(getButtonAttrs)<Props>`
    -webkit-font-smoothing: subpixel-antialiased;
    align-items: center;
    backface-visibility: hidden;
    background-color: transparent;
    border: 1px solid;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    font: var(--sans);
    font-weight: var(--medium);
    justify-content: center;
    letter-spacing: 0;
    padding: 0;
    position: relative;
    text-align: center;
    transform: translate3d(0, 0, 0);
    transition: 200ms ease-in-out;
    transition-property: border-color, background-color, color, transform;
    user-select: none;
    white-space: nowrap;

    &,
    :active,
    :visited,
    :hover,
    :focus {
        text-decoration: none;
        outline: none;
    }

    :hover,
    :focus {
        transition-duration: 5ms;
        transform: scale(1.05) translate3d(0, 0, 0);
    }

    :active {
        transform: scale(0.95) translate3d(0, 0, 0);
    }

    * {
        width: 100%;
    }

    &[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
        transform: scale(1) translate3d(0, 0, 0);
    }

    ${outlineCss}

    ${kindCss}

    ${sizeCss}
`

const Spinner = styled(PrestyledSpinner)`
    width: 16px;
    height: 16px;
    margin-left: 0.5rem;
`
