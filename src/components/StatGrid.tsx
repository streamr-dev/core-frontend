import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
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
    tip,
}: {
    children?: ReactNode
    label?: ReactNode
    tip?: ReactNode
}) {
    return (
        <StatCellRoot>
            <StatCellLabel>{label}</StatCellLabel>
            <StatCellBody>
                <StatCellContent>{children}</StatCellContent>
                {tip && <TipWrap>{tip}</TipWrap>}
            </StatCellBody>
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

export const StatCellContent = styled.div`
    color: ${COLORS.primary};
    font-size: 18px;
    font-weight: ${MEDIUM};
    letter-spacing: -0.05em;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media ${TABLET} {
        font-size: 20px;
    }
`

const StatCellBody = styled.div`
    ${({ children }) =>
        React.Children.count(children) > 1 &&
        css`
            align-items: center;
            display: flex;
        `}
`

const TipWrap = styled.div`
    flex-shrink: 0;
    margin-left: 8px;
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
