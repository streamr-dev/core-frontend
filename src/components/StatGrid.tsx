import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { COLORS, DESKTOP, MEDIUM, TABLET } from '~/shared/utils/styled'

export const StatGrid = styled.div<{
    children?: ReactNode
    $desktopColumnCount?: number
}>`
    align-items: center;
    display: grid;
    gap: 20px;

    @media ${TABLET} {
        gap: 16px;
        grid-template-columns: repeat(
            ${({ children }) => Math.min(3, Math.max(1, React.Children.count(children)))},
            1fr
        );
    }

    @media ${DESKTOP} {
        gap: 24px;
        grid-template-columns: repeat(
            ${({ children, $desktopColumnCount: maxColumns = 4 }) =>
                Math.min(maxColumns, Math.max(1, React.Children.count(children)))},
            1fr
        );
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
    color: #868686;
    font-size: 14px;
    line-height: 24px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    border: 1px solid ${COLORS.Border};
    border-radius: 12px;
    display: flex;
    gap: 8px;
    min-width: 0;
    padding: 16px 20px;

    ${StatCellLabel} {
        flex-grow: 1;
    }

    @media ${TABLET} {
        border-radius: 16px;
        display: block;
        padding: 32px 44px;

        ${StatCellLabel} {
            margin-bottom: 10px;
        }
    }
`
