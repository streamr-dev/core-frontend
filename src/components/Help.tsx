import React, { ComponentProps, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import { MEDIUM, MONO } from '$app/src/shared/utils/styled'

type Alignment = 'left' | 'center' | 'right'

interface Props {
    children?: ReactNode
    align?: Alignment
}

export default function Help({ children, align = 'left' }: Props) {
    return (
        <Root>
            <QuestionMarkIcon />
            <Tooltip $align={align}>{children}</Tooltip>
        </Root>
    )
}

function getQuestionMarkIconAttrs(): ComponentProps<typeof SvgIcon> {
    return { name: 'outlineQuestionMark' }
}

const QuestionMarkIcon = styled(SvgIcon).attrs(getQuestionMarkIconAttrs)`
    display: block;
    height: 16px;
    width: 16px;
    transform: translateY(-2px);
`

const Root = styled.div`
    color: #cdcdcd;
    position: relative;
    transition: 200ms color;
    white-space: normal;
    margin-left: 8px;
    height: 12px;

    :hover {
        color: #323232;
    }

    p {
        line-height: 1.5em;
    }
`

const Tooltip = styled.div<{ $align?: Alignment }>`
    background: #323232;
    border-radius: 4px;
    color: #ffffff;
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0.5rem 0.75rem;
    opacity: 0;
    position: absolute;
    top: 20px;
    transform: translateY(4px);
    transition: 200ms;
    transition-property: visibility, opacity, transform;
    transition-delay: 200ms, 0s, 0s;
    visibility: hidden;
    width: 250px;
    z-index: 1;

    pre {
        color: inherit;
        font-family: ${MONO};
        font-size: 0.9em;
        font-weight: ${MEDIUM};
        margin: 0;
        padding: 0;
    }

    pre,
    p {
        margin: 0;
    }

    pre + p,
    p + p {
        margin-top: 0.75em;
    }

    a {
        color: inherit !important;
        text-decoration: none;
    }

    a:focus,
    a:hover {
        text-decoration: underline;
    }

    ${Root}:hover & {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0s;
        transition-duration: 50ms;
        visibility: visible;
    }

    ${({ $align = 'left' }) => {
        switch ($align) {
            case 'right':
                return css`
                    right: 0;
                `
            case 'center':
                return css`
                    left: 50%;
                    transform: translateY(4px) translateX(-50%);

                    ${Root}:hover & {
                        transform: translateY(0) translateX(-50%);
                    }
                `
            default:
        }
    }}
`
