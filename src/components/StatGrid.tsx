import React, { ComponentProps, ReactNode } from 'react'
import styled from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, MEDIUM, TABLET } from '~/shared/utils/styled'
import { Separator } from './Separator'

export default function StatGrid({ children }: { children?: ReactNode }) {
    return (
        <StatGridRoot $count={React.Children.count(children)}>
            {React.Children.map(children, (child, index) => (
                <>
                    {index ? <Separator /> : null}
                    {child}
                </>
            ))}
        </StatGridRoot>
    )
}

function template({ $count }: { $count: number }) {
    return [...Array($count)].map(() => '1fr').join(' auto ')
}

const StatGridRoot = styled.div<{ $count: number }>`
    ${Separator} {
        margin: 20px 0;
    }

    @media ${TABLET} {
        align-items: center;
        gap: 24px;
        display: grid;
        grid-template-columns: ${template};

        ${Separator} {
            height: auto;
            margin: 0;
            min-height: 88px;
            width: 1px;
        }
    }
`

export function StatCell({
    children,
    label = 'Label',
}: {
    children?: ReactNode
    label?: ReactNode
}) {
    return (
        <StatCellRoot>
            <StatCellLabel>{label}</StatCellLabel>
            <StatCellBody>{children}</StatCellBody>
        </StatCellRoot>
    )
}

export const StatCellLabel = styled.div`
    align-items: center;
    color: #868686;
    display: flex;
    font-size: 14px;
    line-height: 24px;
`

export const StatCellBody = styled.div`
    color: ${COLORS.primary};
    font-size: 18px;
    font-weight: ${MEDIUM};
    letter-spacing: -0.05em;
    line-height: 24px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media ${TABLET} {
        font-size: 20px;
    }
`

const StatCellRoot = styled.div`
    align-items: center;
    display: flex;
    min-width: 0;

    ${StatCellLabel} {
        flex-grow: 1;
    }

    @media ${TABLET} {
        display: block;

        ${StatCellLabel} {
            margin-bottom: 10px;
        }
    }
`

function getTooltipIconAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'outlineQuestionMark',
    }
}

const TooltipIcon = styled(SvgIcon).attrs(getTooltipIconAttrs)`
    color: ${COLORS.primaryDisabled};
    height: 24px;
    padding: 6px;
    width: 24px;
`

export function StatCellLabelTip({ children }: { children?: ReactNode }) {
    return (
        <TipRoot>
            <TooltipIcon />
            <TipBody>
                <TipEffects />
                <TipContent>{children}</TipContent>
            </TipBody>
        </TipRoot>
    )
}

const TipBody = styled.div`
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
        0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    left: 50%;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    transform: translateY(-100%) translateX(-50%);
    transition: 350ms;
    transition-property: visibility, opacity, transform;
    transition-delay: 350ms, 0s, 0s;
    visibility: hidden;
`

const TipContent = styled.div`
    color: #525252;
    font-size: 12px;
    line-height: 1.5em;
    min-width: 240px;
    padding: 8px 12px;
    position: relative;
`

const TipEffects = styled.div`
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    ::after {
        background: #ffffff;
        border-radius: 8px;
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    ::before {
        background: #ffffff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
            0 5px 15px rgba(0, 0, 0, 0.1);
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        left: 50%;
        top: 100%;
        transform: translate(-50%, -50%) translateY(-4px) rotate(45deg);
    }
`

const TipRoot = styled.div`
    height: 24px;
    position: relative;
    width: 24px;

    :hover ${TipBody} {
        opacity: 1;
        visibility: visible;
        transition-delay: 0s;
        transform: translateY(-100%) translateY(-6px) translateX(-50%);
    }
`
