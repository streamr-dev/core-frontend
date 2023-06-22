import React, { FunctionComponent, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBoxSeparator } from '$shared/components/WhiteBox'
import { useWalletAccount } from '$shared/stores/wallet'
import { NoNetworkStats } from '$app/src/network/components/NoNetworkStats'
import { StatsBox } from '$shared/components/StatsBox/StatsBox'
import { ChartPeriod, NetworkChart } from '$shared/components/NetworkChart/NetworkChart'
import useIsMounted from '$shared/hooks/useIsMounted'
import { DelegationChartData, DelegationStats } from '$app/src/network/types/delegations'
import routes from '$routes'
import { NetworkSectionTitle } from './NetworkSectionTitle'
import {
    growingValuesGenerator,
    NetworkChartWrap,
    SummaryContainer,
    WalletNotConnectedOverlay,
} from './SummaryUtils'

const hardcodedDelegationStats: DelegationStats = {
    currentValue: 12300000,
    operators: 8,
    apy: 24.3,
}

const maxDayStats = 10

const hardcodedOperatorChartData: DelegationChartData = {
    currentValue: growingValuesGenerator(
        maxDayStats,
        hardcodedDelegationStats.currentValue,
    ),
    cumulativeEarnings: growingValuesGenerator(maxDayStats, 1400000),
}
export const MyDelegationsSummary: FunctionComponent = () => {
    const isMounted = useIsMounted()
    const walletConnected = !!useWalletAccount()
    const hasOperator = true
    const myDelegationsStats: DelegationStats = hardcodedDelegationStats // todo fetch from state
    const myDelegationsChartData: DelegationChartData = hardcodedOperatorChartData // todo fetch from state

    const statsObject = walletConnected ? myDelegationsStats : hardcodedDelegationStats
    const mappedStats = [
        { label: 'Current value', value: statsObject.currentValue.toString() },
        { label: 'Operators', value: statsObject.operators.toString() },
        { label: 'APY', value: statsObject.apy.toString() + '%' },
    ]
    const chartData = walletConnected
        ? myDelegationsChartData
        : hardcodedOperatorChartData

    const [selectedDataSource, setSelectedDataSource] = useState<string>('currentValue')

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
        <SummaryContainer>
            <div className="title">
                <NetworkSectionTitle>My delegations summary</NetworkSectionTitle>
            </div>
            <WhiteBoxSeparator />
            {hasOperator || !walletConnected ? (
                <>
                    <div
                        className={
                            'summary-container ' +
                            (isMounted() && !walletConnected ? 'blur' : '')
                        }
                    >
                        <StatsBox stats={mappedStats} columns={3} />
                        <WhiteBoxSeparator />
                        <NetworkChartWrap>
                            <NetworkChart
                                dataSources={[
                                    { label: 'Current value', value: 'currentValue' },
                                    {
                                        label: 'Cumulative earnings',
                                        value: 'cumulativeEarnings',
                                    },
                                ]}
                                stats={
                                    selectedDataSource === 'currentValue'
                                        ? chartData.currentValue
                                        : chartData.cumulativeEarnings
                                }
                                onDataSourceChange={handleChartDataSourceChange}
                                onPeriodChange={handleChartPeriodChange}
                                selectedDataSource={selectedDataSource}
                                selectedPeriod={selectedChartPeriod}
                            />
                        </NetworkChartWrap>
                    </div>
                    {isMounted() && !walletConnected && (
                        <WalletNotConnectedOverlay summaryTitle="delegations summary" />
                    )}
                </>
            ) : (
                <NoNetworkStats
                    firstLine="You don't have any delegations yet."
                    secondLine={
                        <span>
                            Please find
                            <Link to={routes.network.operators()}>Operators</Link> to
                            start delegation
                        </span>
                    }
                />
            )}
        </SummaryContainer>
    )
}
