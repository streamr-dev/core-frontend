import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import Layout from '~/components/Layout'
import { NetworkHelmet } from '~/components/Helmet'
import NetworkPageSegment, { Pad } from '~/components/NetworkPageSegment'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { useLoadNetworkStatsEffect, useNetworkStore } from '~/shared/stores/network'
import { TimeSeriesGraph } from '~/shared/components/TimeSeriesGraph'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import { COLORS, MEDIUM, TABLET } from '~/shared/utils/styled'
import WalletPass from '~/components/WalletPass'
import { NoData } from '~/shared/components/NoData'
import routes from '~/routes'
import { useWalletAccount } from '~/shared/stores/wallet'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { HubAvatar } from '~/shared/components/AvatarImage'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { StreamInfoCell } from '~/components/NetworkUtils'
import { fromAtto, fromDecimals } from '~/marketplace/utils/math'
import { useSponsorshipsForCreatorQuery } from '~/hooks/sponsorships'
import { StreamDescription } from '~/components/StreamDescription'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { BNish, toBN } from '~/utils/bn'
import {
    useDelegacyForWalletQuery,
    useDelegacyStats,
    useIsLoadingOperatorForWallet,
    useOperatorForWallet,
    useOperatorStatsForWallet,
} from '~/hooks/operators'
import { TimePeriod, XY } from '~/types'
import { errorToast } from '~/utils/toast'
import { getOperatorDailyBuckets, getTimestampForTimePeriod } from '~/getters'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { OperatorDailyBucket } from '~/generated/gql/network'
import TimePeriodTabs from '~/components/TimePeriodTabs'
import Tabs, { Tab } from '~/shared/components/Tabs'

export function NetworkOverviewPage() {
    const account = useWalletAccount()

    const { setOwner } = useNetworkStore()

    useEffect(() => {
        setOwner(account || '')
    }, [account, setOwner])

    useLoadNetworkStatsEffect()

    return (
        <Layout columnize>
            <NetworkHelmet title="Network Overview" />
            <NetworkStats />
            <MyOperatorSummary />
            <MyDelegationsSummary />
            <MyDelegations />
            <MySponsorships />
        </Layout>
    )
}

function NetworkStats() {
    const { totalStake, numOfSponsorships, numOfOperators } =
        useNetworkStore().networkStats.data

    return (
        <NetworkPageSegment title="Network stats">
            <Pad>
                <StatGrid>
                    <StatCell label="Total stake">{totalStake} DATA</StatCell>
                    <StatCell label="Sponsorships">{numOfSponsorships}</StatCell>
                    <StatCell label="Operators">{numOfOperators}</StatCell>
                </StatGrid>
            </Pad>
        </NetworkPageSegment>
    )
}

function MyOperatorSummary() {
    const wallet = useWalletAccount()

    const stats = useOperatorStatsForWallet(wallet)

    const { value = toBN(0), numOfDelegators = 0, numOfSponsorships = 0 } = stats || {}

    const [chartPeriod, setChartPeriod] = useState<TimePeriod>(TimePeriod.SevenDays)

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
                    dateGreaterEqualThan: getTimestampForTimePeriod(chartPeriod, end),
                    dateLowerThan: end.unix(),
                })

                const { decimals } = await getSponsorshipTokenInfo()

                const toValue: (bucket: OperatorDailyBucket) => BNish =
                    chartId === 'stake'
                        ? ({ poolValue }) => poolValue
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
                        <hr />
                        <Pad>
                            <NetworkChartDisplay
                                periodTabs={
                                    <TimePeriodTabs
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
                                <Chart
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

    const stats = useDelegacyStats(wallet)

    const { value = toBN(0), numOfOperators = 0, minApy = 0, maxApy = 0 } = stats || {}

    const apy = minApy === maxApy ? [minApy] : [minApy, maxApy]

    const [chartPeriod, setChartPeriod] = useState<TimePeriod>(TimePeriod.SevenDays)

    const [chartId, setChartId] = useState<'value' | 'earnings'>('value')

    const { data: chartData = [] } = useQuery<XY[]>({
        queryKey: ['operatorSummaryChartQuery', chartId, chartPeriod, wallet],
        async queryFn() {
            /**
             * @TODO There's no API for getting buckets with profits and amounts
             * aggregated across all eligible operators. Find a way or drop
             * the chart.
             */
            return []
        },
    })

    const chartLabel = chartId === 'value' ? 'Current value' : 'Cumulative earnings'

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
                <hr />
                <Pad>
                    <NetworkChartDisplay
                        periodTabs={
                            <TimePeriodTabs
                                value={chartPeriod}
                                onChange={setChartPeriod}
                            />
                        }
                        sourceTabs={
                            <Tabs
                                selection={chartId}
                                onSelectionChange={(newChartId) => {
                                    if (
                                        newChartId !== 'value' &&
                                        newChartId !== 'earnings'
                                    ) {
                                        return
                                    }

                                    setChartId(newChartId)
                                }}
                            >
                                <Tab id="value">Current value</Tab>
                                <Tab id="earnings">Cumulative earnings</Tab>
                            </Tabs>
                        }
                    >
                        <Chart
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
            </WalletPass>
        </NetworkPageSegment>
    )
}

const Chart = styled(TimeSeriesGraph)`
    margin: 40px 0;

    @media ${TABLET} {
        margin: 64px 0 0;
    }
`

function MyDelegations() {
    const wallet = useWalletAccount()

    const { data } = useDelegacyForWalletQuery(wallet)

    const delegations = data?.pages.flatMap((page) => page.delegations) || []

    return (
        <NetworkPageSegment title="My delegations" foot>
            <WalletPass resourceName="delegations">
                {!wallet || delegations.length ? (
                    <ScrollTableCore
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
                                valueMapper: ({ poolValue }) =>
                                    fromAtto(poolValue).toString(),
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

    const { data } = useSponsorshipsForCreatorQuery(wallet)

    const sponsorships = data?.pages.flatMap((page) => page.sponsorships) || []

    const isLoading = useIsLoadingOperatorForWallet(wallet)

    return (
        <NetworkPageSegment title="My sponsorships" foot>
            <WalletPass resourceName="sponsorships">
                {wallet && isLoading ? (
                    <Pad>Loading…</Pad>
                ) : (
                    <>
                        {!wallet || sponsorships.length ? (
                            <ScrollTableCore
                                elements={sponsorships}
                                columns={[
                                    {
                                        displayName: 'Stream ID',
                                        valueMapper: ({ streamId }) => (
                                            <StreamInfoCell>
                                                <span className="stream-id">
                                                    {truncateStreamName(streamId)}
                                                </span>
                                                <span className="stream-description">
                                                    <StreamDescription
                                                        streamId={streamId}
                                                    ></StreamDescription>
                                                </span>
                                            </StreamInfoCell>
                                        ),
                                        align: 'start',
                                        isSticky: true,
                                        key: 'streamInfo',
                                    },
                                    {
                                        displayName: (
                                            <>
                                                <SponsorshipPaymentTokenName />
                                                /day
                                            </>
                                        ),
                                        valueMapper: (element) =>
                                            element.payoutPerDay.toString(),
                                        align: 'start',
                                        isSticky: false,
                                        key: 'dataPerDay',
                                    },
                                    {
                                        displayName: 'Operators',
                                        valueMapper: (element) => element.operatorCount,
                                        align: 'end',
                                        isSticky: false,
                                        key: 'operators',
                                    },
                                    {
                                        displayName: 'Staked',
                                        valueMapper: (element) =>
                                            element.totalStake.toString(),
                                        align: 'end',
                                        isSticky: false,
                                        key: 'staked',
                                    },
                                    {
                                        displayName: 'APY',
                                        valueMapper: (element) => `${element.apy}%`,
                                        align: 'end',
                                        isSticky: false,
                                        key: 'apy',
                                    },
                                ]}
                            />
                        ) : (
                            <Pad>
                                <NoData
                                    firstLine="You don't have any sponsorships yet."
                                    secondLine={
                                        <>
                                            You can{' '}
                                            <Link to={routes.network.sponsorships()}>
                                                start a sponsorship
                                            </Link>{' '}
                                            here
                                        </>
                                    }
                                />
                            </Pad>
                        )}
                    </>
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}
