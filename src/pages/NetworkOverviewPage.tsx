import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import Layout from '~/components/Layout'
import { NetworkHelmet } from '~/components/Helmet'
import NetworkPageSegment, { Pad, SegmentGrid } from '~/components/NetworkPageSegment'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import WalletPass from '~/components/WalletPass'
import { NoData } from '~/shared/components/NoData'
import routes from '~/routes'
import { useWalletAccount } from '~/shared/stores/wallet'
import { truncate } from '~/shared/utils/text'
import { HubAvatar } from '~/shared/components/AvatarImage'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { fromAtto, fromDecimals } from '~/marketplace/utils/math'
import { useSponsorshipsForCreatorQuery } from '~/hooks/sponsorships'
import { BNish, toBN } from '~/utils/bn'
import {
    useDelegationsForWalletQuery,
    useDelegationsStats,
    useOperatorForWallet,
    useOperatorStatsForWallet,
} from '~/hooks/operators'
import { ChartPeriod, XY } from '~/types'
import { errorToast } from '~/utils/toast'
import { getOperatorDailyBuckets, getTimestampForChartPeriod } from '~/getters'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { OperatorDailyBucket } from '~/generated/gql/network'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { LoadMoreButton } from '~/components/LoadMore'
import { Separator } from '~/components/Separator'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import { refetchQuery } from '~/utils'

export function NetworkOverviewPage() {
    return (
        <Layout columnize>
            <NetworkHelmet title="Network Overview" />
            <SegmentGrid>
                <MyOperatorSummary />
                <MyDelegationsSummary />
                <MyDelegations />
                <MySponsorships />
            </SegmentGrid>
        </Layout>
    )
}

function MyOperatorSummary() {
    const wallet = useWalletAccount()

    const stats = useOperatorStatsForWallet(wallet)

    const { value = toBN(0), numOfDelegators = 0, numOfSponsorships = 0 } = stats || {}

    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>(ChartPeriod.SevenDays)

    const [chartId, setChartId] = useState<'stake' | 'earnings'>('stake')

    const operator = useOperatorForWallet(wallet)

    const { data: chartData = [] } = useQuery<XY[]>({
        queryKey: ['operatorSummaryChartQuery', chartId, chartPeriod, operator?.id],
        async queryFn() {
            if (!operator) {
                return []
            }

            try {
                const end = moment().utc().subtract(1, 'day').endOf('day')

                const buckets = await getOperatorDailyBuckets(operator.id, {
                    dateGreaterEqualThan: getTimestampForChartPeriod(
                        chartPeriod,
                        end,
                    ).unix(),
                    dateLowerThan: end.unix(),
                })

                const { decimals } = await getSponsorshipTokenInfo()

                const toValue: (bucket: OperatorDailyBucket) => BNish =
                    chartId === 'stake'
                        ? ({ valueWithoutEarnings }) => valueWithoutEarnings
                        : ({ profitsWei }) => profitsWei

                return buckets.map((bucket) => ({
                    x: Number(bucket.date) * 1000,
                    y: fromDecimals(
                        toValue(bucket as OperatorDailyBucket),
                        decimals,
                    ).toNumber(),
                }))
            } catch (e) {
                errorToast({ title: 'Could not load operator chart data' })

                console.warn('Could not load operator chart data', e)
            }

            return []
        },
    })

    const chartLabel = chartId === 'stake' ? 'Total stake' : 'Cumulative earnings'

    return (
        <NetworkPageSegment title="My operator summary">
            <WalletPass resourceName="operator summary" roundBorders>
                {!wallet || stats !== null ? (
                    <>
                        <Pad>
                            <StatGrid>
                                <StatCell label="Total value">
                                    {fromAtto(value).toString()} DATA
                                </StatCell>
                                <StatCell label="Delegators">{numOfDelegators}</StatCell>
                                <StatCell label="Sponsorships">
                                    {numOfSponsorships}
                                </StatCell>
                            </StatGrid>
                        </Pad>
                        <Separator />
                        <Pad>
                            <NetworkChartDisplay
                                periodTabs={
                                    <ChartPeriodTabs
                                        value={chartPeriod}
                                        onChange={setChartPeriod}
                                    />
                                }
                                sourceTabs={
                                    <Tabs
                                        selection={chartId}
                                        onSelectionChange={(newChartId) => {
                                            if (
                                                newChartId !== 'stake' &&
                                                newChartId !== 'earnings'
                                            ) {
                                                return
                                            }

                                            setChartId(newChartId)
                                        }}
                                    >
                                        <Tab id="stake">Total stake</Tab>
                                        <Tab id="earnings">Cumulative earnings</Tab>
                                    </Tabs>
                                }
                            >
                                <NetworkChart
                                    tooltipValuePrefix={chartLabel}
                                    graphData={chartData}
                                    xAxisDisplayFormatter={formatShortDate}
                                    yAxisAxisDisplayFormatter={(value) =>
                                        truncateNumber(value, 'thousands')
                                    }
                                    tooltipLabelFormatter={formatLongDate}
                                    tooltipValueFormatter={(value) =>
                                        `${truncateNumber(value, 'thousands')} DATA`
                                    }
                                />
                            </NetworkChartDisplay>
                        </Pad>
                    </>
                ) : (
                    <>
                        <Pad>
                            <NoData
                                firstLine="You haven't initialized your operator."
                                secondLine={
                                    <>
                                        You can become an operator on the{' '}
                                        <Link to={routes.network.operators()}>
                                            Operators
                                        </Link>{' '}
                                        page.
                                    </>
                                }
                            />
                        </Pad>
                    </>
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}

function MyDelegationsSummary() {
    const wallet = useWalletAccount()

    const stats = useDelegationsStats(wallet)

    const { value = toBN(0), numOfOperators = 0, minApy = 0, maxApy = 0 } = stats || {}

    const apy = minApy === maxApy ? [minApy] : [minApy, maxApy]

    return (
        <NetworkPageSegment title="My delegations summary">
            <WalletPass resourceName="delegations summary" roundBorders>
                <Pad>
                    <StatGrid>
                        <StatCell label="Current value">
                            {fromAtto(value).toString()} DATA
                        </StatCell>
                        <StatCell label="Operators">{numOfOperators}</StatCell>
                        <StatCell label="APY">{apy.join('-')}%</StatCell>
                    </StatGrid>
                </Pad>
            </WalletPass>
        </NetworkPageSegment>
    )
}

function MyDelegations() {
    const wallet = useWalletAccount()

    const query = useDelegationsForWalletQuery(wallet)

    const isLoading = query.isLoading || query.isFetching

    const delegations = query.data?.pages.flatMap((page) => page.delegations) || []

    return (
        <NetworkPageSegment title="My delegations" foot>
            <WalletPass resourceName="delegations">
                {!wallet || delegations.length || isLoading ? (
                    <>
                        <ScrollTableCore
                            isLoading={isLoading}
                            elements={delegations}
                            columns={[
                                {
                                    displayName: 'Operator ID',
                                    valueMapper: ({ id }) => (
                                        <OperatorCell>
                                            <HubAvatar id={id} /> {truncate(id)}
                                        </OperatorCell>
                                    ),
                                    align: 'start',
                                    isSticky: true,
                                    key: 'operatorId',
                                },
                                {
                                    displayName: 'My share',
                                    valueMapper: ({ myShare }) =>
                                        fromAtto(myShare).toString(),
                                    align: 'start',
                                    isSticky: false,
                                    key: 'myShare',
                                },
                                {
                                    displayName: 'Total stake',
                                    valueMapper: ({ valueWithoutEarnings }) =>
                                        fromAtto(valueWithoutEarnings).toString(),
                                    align: 'end',
                                    isSticky: false,
                                    key: 'totalStake',
                                },
                                {
                                    displayName: "Operator's cut",
                                    valueMapper: ({ operatorsCut }) => `${operatorsCut}%`,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'operatorsCut',
                                },
                                {
                                    displayName: 'APY',
                                    valueMapper: ({ apy }) => `${apy}%`,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'apy',
                                },
                                {
                                    displayName: 'Sponsorships',
                                    valueMapper: (element) => element.stakes.length,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'sponsorships',
                                },
                            ]}
                        />
                        {query.hasNextPage ? (
                            <LoadMoreButton
                                disabled={isLoading}
                                onClick={() => void query.fetchNextPage()}
                                kind="primary2"
                            >
                                Load more
                            </LoadMoreButton>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <NoData
                        firstLine="You haven't delegated to anyone yet."
                        secondLine={
                            <>
                                You can browse{' '}
                                <Link to={routes.network.operators()}>operators</Link> to
                                start delegating.
                            </>
                        }
                    />
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}

const OperatorCell = styled.div`
    align-items: center;
    color: ${COLORS.primary};
    display: flex;
    font-weight: ${MEDIUM};
    gap: 5px;
`

function MySponsorships() {
    const wallet = useWalletAccount()

    const query = useSponsorshipsForCreatorQuery(wallet)

    function refetch() {
        refetchQuery(query)
    }

    return (
        <NetworkPageSegment title="My sponsorships" foot>
            <WalletPass resourceName="sponsorships">
                <QueriedSponsorshipsTable
                    query={query}
                    onSponsorshipFunded={refetch}
                    onSponsorshipJoined={refetch}
                    onStakeEdited={refetch}
                    noDataFirstLine="You don't have any sponsorships yet."
                    noDataSecondLine={
                        <>
                            You can{' '}
                            <Link to={routes.network.sponsorships()}>
                                start a sponsorship
                            </Link>{' '}
                            here
                        </>
                    }
                />
            </WalletPass>
        </NetworkPageSegment>
    )
}
