import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { COLORS, MEDIUM, REGULAR, TABLET } from '$shared/utils/styled'

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
    border-top: 1px solid ${COLORS.separator};
    padding: 24px 0;
    @media (${TABLET}) {
        padding: 24px;
    }

    .cell-inner {
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
    if (stats.length % columns !== 0) {
        throw new Error('Invalid amount of stats provided')
    }
    return (
        <StatsGrid className={`column-count-${columns}`}>
            {stats.map((stat, index) => (
                <StatsCell key={index}>
                    <div
                        className={
                            'cell-inner ' +
                            ((index + 1) % columns === 0 ? 'no-border' : '')
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
