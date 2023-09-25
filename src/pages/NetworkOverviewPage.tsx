import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
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
import { fromAtto } from '~/marketplace/utils/math'
import { useSponsorshipsForCreatorQuery } from '~/hooks/sponsorships'
import { StreamDescription } from '~/components/StreamDescription'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'

export function NetworkOverviewPage() {
    const account = useWalletAccount()

    const { setOwner } = useNetworkStore()

    useEffect(() => {
        setOwner(account || '')
    }, [account, setOwner])

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
    useLoadNetworkStatsEffect()

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
    const {
        operatorStats: {
            data: { value, numOfDelegators, numOfSponsorships },
        },
        chartData: {
            operatorStake: { data: operatorStakeData },
            operatorEarnings: { data: operatorEarningsData },
        },
        operator,
        owner,
    } = useNetworkStore()

    return (
        <NetworkPageSegment title="My operator summary">
            <WalletPass resourceName="operator summary" roundBorders>
                {owner && typeof operator === 'undefined' ? (
                    <Pad>Loading…</Pad>
                ) : (
                    <>
                        {!owner || operator ? (
                            <>
                                <Pad>
                                    <StatGrid>
                                        <StatCell label="Total value">
                                            {fromAtto(value).toString()} DATA
                                        </StatCell>
                                        <StatCell label="Delegators">
                                            {numOfDelegators}
                                        </StatCell>
                                        <StatCell label="Sponsorships">
                                            {numOfSponsorships}
                                        </StatCell>
                                    </StatGrid>
                                </Pad>
                                <hr />
                                <Pad>
                                    <NetworkChartDisplay
                                        dataSets={[
                                            {
                                                id: 'stake',
                                                label: 'Total stake',
                                                data: operatorStakeData,
                                            },
                                            {
                                                id: 'earnings',
                                                label: 'Cumulative earnings',
                                                data: operatorEarningsData,
                                            },
                                        ]}
                                    >
                                        {({ label, data }) => (
                                            <Chart
                                                tooltipValuePrefix={label}
                                                graphData={[...data]}
                                                xAxisDisplayFormatter={formatShortDate}
                                                yAxisAxisDisplayFormatter={(value) =>
                                                    truncateNumber(value, 'thousands')
                                                }
                                                tooltipLabelFormatter={formatLongDate}
                                                tooltipValueFormatter={(value) =>
                                                    `${truncateNumber(
                                                        value,
                                                        'thousands',
                                                    )} DATA`
                                                }
                                            />
                                        )}
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
                    </>
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}

function MyDelegationsSummary() {
    const {
        delegationStats: {
            data: {
                value,
                numOfOperators,
                apyRange: [minApy, maxApy],
            },
        },
        chartData: {
            delegationsValue: { data: delegationsValueData },
            delegationsEarnings: { data: delegationsEarningsData },
        },
    } = useNetworkStore()

    const noData = false

    const apy = minApy === maxApy ? minApy : `${minApy}-${maxApy}`

    return (
        <NetworkPageSegment title="My delegations summary">
            <WalletPass resourceName="delegations summary" roundBorders>
                {noData ? (
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
                ) : (
                    <>
                        <Pad>
                            <StatGrid>
                                <StatCell label="Current value">
                                    {fromAtto(value).toString()} DATA
                                </StatCell>
                                <StatCell label="Operators">{numOfOperators}</StatCell>
                                <StatCell label="APY">{apy}%</StatCell>
                            </StatGrid>
                        </Pad>
                        <hr />
                        <Pad>
                            <NetworkChartDisplay
                                dataSets={[
                                    {
                                        id: 'value',
                                        label: 'Current value',
                                        data: delegationsValueData,
                                    },
                                    {
                                        id: 'earnings',
                                        label: 'Cumulative earnings',
                                        data: delegationsEarningsData,
                                    },
                                ]}
                            >
                                {({ label, data }) => (
                                    <Chart
                                        tooltipValuePrefix={label}
                                        graphData={[...data]}
                                        xAxisDisplayFormatter={formatShortDate}
                                        yAxisAxisDisplayFormatter={(value) =>
                                            truncateNumber(value, 'thousands')
                                        }
                                        tooltipLabelFormatter={formatLongDate}
                                        tooltipValueFormatter={(value) =>
                                            `${truncateNumber(value, 'thousands')} DATA`
                                        }
                                    />
                                )}
                            </NetworkChartDisplay>
                        </Pad>
                    </>
                )}
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
    const { delegations, operator, owner } = useNetworkStore()

    return (
        <NetworkPageSegment title="My delegations" foot>
            <WalletPass resourceName="delegations">
                {owner && typeof operator === 'undefined' ? (
                    <Pad>Loading…</Pad>
                ) : !owner || delegations.length ? (
                    <ScrollTableCore
                        elements={delegations}
                        columns={[
                            {
                                displayName: 'Operator ID',
                                valueMapper: ({ operatorId }) => (
                                    <OperatorCell>
                                        <HubAvatar id={operatorId} />{' '}
                                        {truncate(operatorId)}
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
                                valueMapper: ({ totalStake }) =>
                                    fromAtto(totalStake).toString(),
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
                                valueMapper: (element) => element.sponsorships,
                                align: 'end',
                                isSticky: false,
                                key: 'sponsorships',
                            },
                        ]}
                        actions={[
                            {
                                displayName: 'Edit',
                                callback: (element) =>
                                    console.warn('editing! ' + element.operatorId),
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
    const { operator, owner } = useNetworkStore()

    const { data } = useSponsorshipsForCreatorQuery(owner)

    const sponsorships = data?.pages.flatMap((page) => page.sponsorships) || []

    return (
        <NetworkPageSegment title="My sponsorships" foot>
            <WalletPass resourceName="sponsorships">
                {owner && typeof operator === 'undefined' ? (
                    <Pad>Loading…</Pad>
                ) : !owner || sponsorships.length ? (
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
                                valueMapper: (element) => element.payoutPerDay.toString(),
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
                                valueMapper: (element) => element.totalStake.toString(),
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
                        actions={[
                            {
                                displayName: 'Edit',
                                callback: (element) =>
                                    console.warn('editing! ' + element.streamId),
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
            </WalletPass>
        </NetworkPageSegment>
    )
}
