import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import { NoData } from '~/shared/components/NoData'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { LAPTOP } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'
import { errorToast } from '~/utils/toast'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { SponsorshipActionBar } from '~/components/ActionBars/SponsorshipActionBar'
import { useSponsorshipFundingHistory } from '~/hooks/useSponsorshipFundingHistory'
import { getSponsorshipStats } from '~/getters/getSponsorshipStats'
import { ChartPeriod } from '~/types'
import NetworkPageSegment, { SegmentGrid, Pad } from '~/components/NetworkPageSegment'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import { useSponsorshipQuery, useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { OperatorIdCell } from '~/components/Table'

export const SingleSponsorshipPage = () => {
    const sponsorshipId = useParams().id || ''

    const sponsorshipQuery = useSponsorshipQuery(sponsorshipId)

    const sponsorship = sponsorshipQuery.data || null

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

    const [selectedDataSource, setSelectedDataSource] = useState<
        'amountStaked' | 'numberOfOperators' | 'apy'
    >('amountStaked')

    const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(
        ChartPeriod.SevenDays,
    )

    const chartQuery = useQuery({
        queryKey: [
            'sponsorshipChartQuery',
            sponsorshipId,
            selectedPeriod,
            selectedDataSource,
        ],
        queryFn: async () => {
            try {
                if (!sponsorshipId) {
                    return []
                }

                return await getSponsorshipStats(
                    sponsorshipId,
                    selectedPeriod,
                    selectedDataSource,
                    false, // ignore today
                )
            } catch (e) {
                console.warn('Could not load sponsorship chart data', e)

                errorToast({ title: 'Could not load sponsorship chart data' })
            }

            return []
        },
    })

    const { data: chartData = [] } = chartQuery

    const tooltipPrefix = useMemo(() => {
        switch (selectedDataSource) {
            case 'amountStaked':
                return 'Amount Staked'
            case 'numberOfOperators':
                return 'Number of Operators'
            case 'apy':
                return 'APY'
            default:
                return ''
        }
    }, [selectedDataSource])

    const formatTooltipValue = useCallback(
        (value: number) => {
            switch (selectedDataSource) {
                case 'amountStaked':
                    return `${abbreviateNumber(value)} ${tokenSymbol}`
                case 'numberOfOperators':
                    return value.toString()
                case 'apy':
                    return `${value.toFixed(2)}%`
                default:
                    return ''
            }
        },
        [selectedDataSource, tokenSymbol],
    )

    const formatYAxisValue = useCallback(
        (value: number) => {
            switch (selectedDataSource) {
                case 'amountStaked':
                    return `${abbreviateNumber(value)}`
                case 'numberOfOperators':
                    return value.toString()
                case 'apy':
                    return `${value.toFixed(2)}%`
                default:
                    return ''
            }
        },
        [selectedDataSource],
    )

    const fundingEventsQuery = useSponsorshipFundingHistory(sponsorshipId)

    return (
        <Layout>
            <NetworkHelmet title="Sponsorship" />
            <LoadingIndicator
                loading={sponsorshipQuery.isLoading || sponsorshipQuery.isFetching}
            />
            {!!sponsorship && (
                <SponsorshipActionBar
                    sponsorship={sponsorship}
                    onChange={() => {
                        sponsorshipQuery.refetch()
                        chartQuery.refetch()
                        fundingEventsQuery.refetch()
                    }}
                />
            )}
            <LayoutColumn>
                {sponsorship == null ? (
                    <>
                        {!(sponsorshipQuery.isLoading || sponsorshipQuery.isFetching) && (
                            <NoData firstLine={'Sponsorship not found.'} />
                        )}
                    </>
                ) : (
                    <>
                        <SegmentGrid>
                            <ChartGrid>
                                <NetworkPageSegment title="Overview charts">
                                    <Pad>
                                        <NetworkChartDisplay
                                            periodTabs={
                                                <ChartPeriodTabs
                                                    value={selectedPeriod}
                                                    onChange={setSelectedPeriod}
                                                />
                                            }
                                            sourceTabs={
                                                <Tabs
                                                    selection={selectedDataSource}
                                                    onSelectionChange={(dataSource) => {
                                                        if (
                                                            dataSource !==
                                                                'amountStaked' &&
                                                            dataSource !==
                                                                'numberOfOperators' &&
                                                            dataSource !== 'apy'
                                                        ) {
                                                            return
                                                        }

                                                        setSelectedDataSource(dataSource)
                                                    }}
                                                >
                                                    <Tab id="amountStaked">
                                                        Amount Staked
                                                    </Tab>
                                                    <Tab id="numberOfOperators">
                                                        Number of Operators
                                                    </Tab>
                                                    <Tab id="apy">APY</Tab>
                                                </Tabs>
                                            }
                                        >
                                            <NetworkChart
                                                isLoading={
                                                    chartQuery.isLoading ||
                                                    chartQuery.isFetching
                                                }
                                                tooltipValuePrefix={tooltipPrefix}
                                                graphData={chartData}
                                                xAxisDisplayFormatter={formatShortDate}
                                                yAxisAxisDisplayFormatter={
                                                    formatYAxisValue
                                                }
                                                tooltipLabelFormatter={formatLongDate}
                                                tooltipValueFormatter={formatTooltipValue}
                                            />
                                        </NetworkChartDisplay>
                                    </Pad>
                                </NetworkPageSegment>
                                <NetworkPageSegment title="Operators">
                                    <ScrollTable
                                        elements={sponsorship.stakes}
                                        columns={[
                                            {
                                                displayName: 'Operator ID',
                                                key: 'operatorId',
                                                isSticky: true,
                                                valueMapper: ({
                                                    operatorId,
                                                    metadata: { imageUrl, name },
                                                }) => (
                                                    <OperatorIdCell
                                                        operatorId={operatorId}
                                                        imageUrl={imageUrl}
                                                        operatorName={name}
                                                    />
                                                ),
                                                align: 'start',
                                            },
                                            {
                                                displayName: 'Staked',
                                                key: 'staked',
                                                isSticky: true,
                                                valueMapper: (stake) =>
                                                    abbreviateNumber(
                                                        Number(stake.amount),
                                                    ).toString(),
                                                align: 'end',
                                            },
                                        ]}
                                    />
                                </NetworkPageSegment>
                            </ChartGrid>
                            <NetworkPageSegment foot title="Funding history">
                                <ScrollTable
                                    hasMoreResults={fundingEventsQuery.hasNextPage}
                                    onLoadMore={() => fundingEventsQuery.fetchNextPage()}
                                    elements={
                                        fundingEventsQuery.data?.pages
                                            .map((page) => page.events)
                                            .flat() || []
                                    }
                                    isLoading={
                                        fundingEventsQuery.isLoading ||
                                        fundingEventsQuery.isFetching
                                    }
                                    columns={[
                                        {
                                            displayName: 'Date',
                                            valueMapper: (element: any) => element.date,
                                            align: 'start',
                                            isSticky: true,
                                            key: 'date',
                                        },
                                        {
                                            displayName: 'Amount',
                                            valueMapper: (element: any) =>
                                                `${abbreviateNumber(
                                                    Number(element.amount),
                                                )} ${tokenSymbol}`,
                                            align: 'start',
                                            isSticky: false,
                                            key: 'amount',
                                        },
                                        {
                                            displayName: 'Sponsor',
                                            valueMapper: (element: any) =>
                                                truncate(element.sponsor),
                                            align: 'start',
                                            isSticky: false,
                                            key: 'sponsor',
                                        },
                                    ]}
                                />
                            </NetworkPageSegment>
                        </SegmentGrid>
                    </>
                )}
            </LayoutColumn>
        </Layout>
    )
}

const ChartGrid = styled(SegmentGrid)`
    grid-template-columns: minmax(0, 1fr);

    @media ${LAPTOP} {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
`
