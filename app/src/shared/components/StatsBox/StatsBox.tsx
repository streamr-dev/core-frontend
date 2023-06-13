import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components'
import { COLORS, LAPTOP, MEDIUM, REGULAR, TABLET } from '$shared/utils/styled'

const StatsGrid = styled.div`
    display: grid;

    grid-template-columns: 1fr;

    &.column-count-3 {
        @media (${TABLET}) {
            grid-template-columns: 33.33% 33.33% 33.33%;
        }
    }

    &.column-count-4 {
        @media (${TABLET}) {
            grid-template-columns: 25% 25% 25% 25%;
        }
    }
`

const StatsCell = styled.div`
    border-bottom: 1px solid ${COLORS.separator};
    padding: 24px 0;
    &.column-count-3 {
        &:nth-last-child(-n + 3) {
            // last row
            border-bottom: none;
        }
        /*&:nth-child(-n + 3) {
            // first row
        }*/
        &:nth-child(3n) {
            // last column
            @media (${LAPTOP}) {
                padding-right: 16px;
            }
        }
        &:nth-child(3n-2) {
            // first column
            @media (${LAPTOP}) {
                padding-left: 16px;
            }
        }
    }

    &.column-count-4 {
        &:nth-last-child(-n + 4) {
            // last row
            border-bottom: none;
        }
        &:nth-child(4n) {
            // last column
            @media (${LAPTOP}) {
                padding-right: 16px;
            }
        }
        &:nth-child(4n-3) {
            // first column
            @media (${LAPTOP}) {
                padding-left: 16px;
            }
        }
    }

    .cell-inner {
        padding: 0 24px;
        /*@media (${TABLET}) {
            padding: 24px;
        }*/
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        @media (${TABLET}) {
            border-right: 1px solid ${COLORS.separator};
            flex-direction: column;
            justify-content: center;
        }

        &.no-border {
            border-right: none;
        }
    }
`

const StatsLabel = styled.p`
    font-size: 14px;
    font-weight: ${REGULAR};
    color: ${COLORS.primaryLight};
    margin: 0;
    line-height: 24px;
    @media (${TABLET}) {
        margin-bottom: 10px;
    }
`

const StatsValue = styled.p`
    font-size: 18px;
    font-weight: ${MEDIUM};
    color: ${COLORS.primary};
    margin: 0;
    line-height: 24px;
    @media (${TABLET}) {
        font-size: 20px;
    }
`

export const StatsBox: FunctionComponent<{
    stats: { label: string; value: string }[]
    columns: 3 | 4
}> = ({ stats, columns }) => {
    const statsCells = useMemo(() => {
        const modulo = stats.length % columns
        if (modulo == 0) {
            return stats
        }
        const newStatsArray = [...stats]
        const amountToAdd = columns - modulo
        for (let i = 0; i < amountToAdd; i++) {
            newStatsArray.push({ label: '\xa0', value: '\xa0' })
        }
        return newStatsArray
    }, [stats, columns])
    return (
        <StatsGrid className={`column-count-${columns}`}>
            {statsCells.map((stat, index) => (
                <StatsCell key={index} className={`column-count-${columns}`}>
                    <div
                        className={
                            'cell-inner ' +
                            ((index + 1) % columns === 0 || stat.label === '\xa0'
                                ? 'no-border'
                                : '')
                        }
                    >
                        <StatsLabel>{stat.label}</StatsLabel>
                        <StatsValue>{stat.value}</StatsValue>
                    </div>
                </StatsCell>
            ))}
        </StatsGrid>
    )
}
