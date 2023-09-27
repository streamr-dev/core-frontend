import React, { FunctionComponent, useMemo, useState } from 'react'
import styled from 'styled-components'
import { COLORS, LAPTOP, MD, MEDIUM, REGULAR, TABLET } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { WhiteTooltip } from '~/shared/components/Tooltip/Tooltip'

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
    padding: 32px 0;
    &.column-count-3 {
        &:nth-last-child(-n + 3) {
            // last row
            @media (${TABLET}) {
                border-bottom: none;
            }
        }
        &:nth-child(3n) {
            // last column
            @media (${TABLET}) {
                padding-right: 16px;
            }
        }
        &:nth-child(3n-2) {
            // first column
            @media (${TABLET}) {
                padding-left: 16px;
            }
        }

        @media (max-width: ${MD - 1}px) {
            :last-child {
                border-bottom: none;
            }
        }
    }

    &.column-count-4 {
        &:nth-last-child(-n + 4) {
            // last row
            @media (${TABLET}) {
                border-bottom: none;
            }
        }
        &:nth-child(4n) {
            // last column
            @media (${TABLET}) {
                padding-right: 16px;
            }
        }
        &:nth-child(4n-3) {
            // first column
            @media (${TABLET}) {
                padding-left: 16px;
            }
        }
    }

    .cell-inner {
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        @media (${TABLET}) {
            padding: 12px 24px;
            border-right: 1px solid ${COLORS.separator};
            flex-direction: column;
            justify-content: center;
        }

        &.no-border {
            border-right: none;
        }
    }
`

export const StatsLabel = styled.div`
    font-size: 14px;
    font-weight: ${REGULAR};
    color: ${COLORS.primaryLight};
    margin: 0;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    @media (${TABLET}) {
        margin-bottom: 10px;
    }
`

export const StatsValue = styled.div`
    font-size: 18px;
    font-weight: ${MEDIUM};
    color: ${COLORS.primary};
    margin: 0;
    line-height: 24px;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    @media (${TABLET}) {
        font-size: 20px;
        text-align: left;
    }
`

const TooltipIcon = styled(SvgIcon)`
    color: ${COLORS.primaryDisabled};
    width: 24px;
    height: 24px;
    padding: 6px;
    cursor: pointer;
`
export const StatsBox: FunctionComponent<{
    stats: {
        label: string
        value: string
        hoverValue?: string
        tooltipText?: string
    }[]
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

    const [openTooltipId, setOpenTooltipId] = useState<string | null>(null)
    return (
        <StatsGrid className={`column-count-${columns}`}>
            {statsCells.map((stat, index) => {
                // preparing the id of tooltip element based on the contents of the stat so it will be unique and it won't change
                const id = (stat.label + stat.value).replace(/[^A-Za-z]/g, '')
                return (
                    <StatsCell key={index} className={`column-count-${columns}`}>
                        <div
                            className={
                                'cell-inner ' +
                                ((index + 1) % columns === 0 || stat.label === '\xa0'
                                    ? 'no-border'
                                    : '')
                            }
                        >
                            <StatsLabel>
                                {stat.label}{' '}
                                {stat.tooltipText && (
                                    <TooltipIcon
                                        name={'outlineQuestionMark'}
                                        data-tooltip-id={id}
                                    />
                                )}
                            </StatsLabel>
                            <StatsValue title={stat.hoverValue}>{stat.value}</StatsValue>
                            {stat.tooltipText && (
                                <WhiteTooltip id={id} openOnClick={true}>
                                    {stat.tooltipText}
                                </WhiteTooltip>
                            )}
                        </div>
                    </StatsCell>
                )
            })}
        </StatsGrid>
    )
}