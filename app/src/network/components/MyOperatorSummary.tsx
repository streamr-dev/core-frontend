import React, { FunctionComponent, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
    WhiteBox,
    WhiteBoxPaddingStyles,
    WhiteBoxSeparator,
} from '$shared/components/WhiteBox'
import { useWalletAccount } from '$shared/stores/wallet'
import { NoNetworkStats } from '$app/src/network/components/NoNetworkStats'
import { StatsBox } from '$shared/components/StatsBox/StatsBox'
import { ChartPeriod, NetworkChart } from '$shared/components/NetworkChart/NetworkChart'
import routes from '$routes'
import { OperatorChartData, OperatorStats } from '../types/operator'
import { NetworkSectionTitle } from './NetworkSectionTitle'

const OperatorSummaryContainer = styled(WhiteBox)`
    margin-bottom: 24px;
    .title {
        ${WhiteBoxPaddingStyles}
    }
`

const OperatorChartWrap = styled.div`
    ${WhiteBoxPaddingStyles}
`

const hardcodedOperatorStats: OperatorStats = {
    delegators: 124,
    sponsorships: 2,
    totalStake: 24000000,
}
const today = moment()
const maxDayStats = 10
const maxHardcodedStake = 25000000
const maxHardcodedCumulativeEarning = 2000000
const hardcodedOperatorChartData: OperatorChartData = {
    totalStake: new Array(maxDayStats).fill(null).map((_, index) => {
        return {
            day: Number(today.subtract(maxDayStats - index, 'days').format('x')),
            value: maxHardcodedStake * ((index + 1) / maxDayStats) * Math.random(),
        }
    }),
    cumulativeEarnings: new Array(maxDayStats).fill(null).map((_, index) => {
        return {
            day: Number(today.subtract(maxDayStats - index, 'days').format('x')),
            value:
                maxHardcodedCumulativeEarning *
                ((index + 1) / maxDayStats) *
                Math.random(),
        }
    }),
}
export const MyOperatorSummary: FunctionComponent = () => {
    const walletConnected = !!useWalletAccount()
    const hasOperator = true
    const myOperatorStats: OperatorStats = hardcodedOperatorStats // todo fetch from state
    const myOperatorChartData: OperatorChartData = hardcodedOperatorChartData // todo fetch from state

    const statsObject = walletConnected ? myOperatorStats : hardcodedOperatorStats
    const mappedStats = [
        { label: 'Total stake', value: statsObject.totalStake.toString() },
        { label: 'Delegators', value: statsObject.delegators.toString() },
        { label: 'Sponsorships', value: statsObject.sponsorships.toString() },
    ]
    const chartData = walletConnected ? myOperatorChartData : hardcodedOperatorChartData

    const [selectedDataSource, setSelectedDataSource] = useState<string>('totalStake')

    const [selectedChartPeriod, setSelectedChartPeriod] = useState<ChartPeriod>(
        ChartPeriod['7D'],
    )

    const handleChartDataSourceChange = useCallback(
        async (dataSource: string) => {
            setSelectedDataSource(dataSource)
            // todo fetch data
        },
        [setSelectedChartPeriod, setSelectedDataSource],
    )

    const handleChartPeriodChange = useCallback(
        async (period: ChartPeriod) => {
            setSelectedChartPeriod(period)
            // todo fetch data
        },
        [setSelectedChartPeriod, selectedChartPeriod],
    )

    return (
        <OperatorSummaryContainer>
            <div className="title">
                <NetworkSectionTitle>My operator summary</NetworkSectionTitle>
            </div>
            <WhiteBoxSeparator />
            {hasOperator ? (
                <>
                    <StatsBox stats={mappedStats} columns={3} />
                    <WhiteBoxSeparator />
                    <OperatorChartWrap>
                        <NetworkChart
                            dataSources={[
                                { label: 'Total stake', value: 'totalStake' },
                                {
                                    label: 'Cumulative earnings',
                                    value: 'cumulativeEarnings',
                                },
                            ]}
                            stats={
                                selectedDataSource === 'totalStake'
                                    ? chartData.totalStake
                                    : chartData.cumulativeEarnings
                            }
                            onDataSourceChange={handleChartDataSourceChange}
                            onPeriodChange={handleChartPeriodChange}
                            selectedDataSource={selectedDataSource}
                            selectedPeriod={selectedChartPeriod}
                        />
                    </OperatorChartWrap>
                </>
            ) : (
                <NoNetworkStats
                    firstLine="You don't have any operator yet."
                    secondLine={
                        <span>
                            <Link to={routes.network.createOperator()}>
                                Create a operator
                            </Link>{' '}
                            now.
                        </span>
                    }
                />
            )}
        </OperatorSummaryContainer>
    )
}
