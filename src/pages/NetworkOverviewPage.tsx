import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Layout from '~/components/Layout'
import { NetworkHelmet } from '~/components/Helmet'
import NetworkPageSegment, { Pad } from '~/components/NetworkPageSegment'
import StatGrid, { StatCell } from '~/components/StatGrid'
import {
    useChartData,
    useDelegationStats,
    useDelegations,
    useIsOperator,
    useNetworkStats,
    useOperatorStats,
    useSponsorships,
} from '~/shared/stores/network'
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

export const NetworkOverviewPage = () => {
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
    const { totalStake, numOfSponsorships, numOfOperators } = useNetworkStats()

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
    const { value, numOfDelegators, numOfSponsorships } = useOperatorStats()

    const { operatorStakeData, operatorEarningsData } = useChartData()

    const isOperator = useIsOperator()

    const wallet = useWalletAccount()

    return (
        <NetworkPageSegment title="My operator summary">
            <WalletPass resourceName="operator summary" roundBorders>
                {isOperator || !wallet ? (
                    <>
                        <Pad>
                            <StatGrid>
                                <StatCell label="Total value">{value} DATA</StatCell>
                                <StatCell label="Delegators">{numOfDelegators}</StatCell>
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
                                        graphData={data}
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
                ) : (
                    <Pad>
                        <NoData
                            firstLine="You haven't initialized your operator."
                            secondLine={
                                <>
                                    You can become an operator on the{' '}
                                    <Link to={routes.network.operators()}>Operators</Link>{' '}
                                    page.
                                </>
                            }
                        />
                    </Pad>
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}

function MyDelegationsSummary() {
    const { value, numOfOperators, apy } = useDelegationStats()

    const { delegationsValueData, delegationsEarningsData } = useChartData()

    const noData = false

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
                                <StatCell label="Current value">{value} DATA</StatCell>
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
                                        graphData={data}
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
    const delegations = useDelegations()

    const noData = false

    return (
        <NetworkPageSegment title="My delegations" foot>
            <WalletPass resourceName="delegations">
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
                    <ScrollTableCore
                        elements={delegations}
                        columns={[
                            {
                                displayName: 'Operator ID',
                                valueMapper: (element) => (
                                    <OperatorCell>
                                        <HubAvatar id={element.operatorId} />{' '}
                                        {truncate(element.operatorId)}
                                    </OperatorCell>
                                ),
                                align: 'start',
                                isSticky: true,
                                key: 'operatorId',
                            },
                            {
                                displayName: 'My share',
                                valueMapper: (element) =>
                                    truncateNumber(element.myShare, 'thousands'),
                                align: 'start',
                                isSticky: false,
                                key: 'myShare',
                            },
                            {
                                displayName: 'Total stake',
                                valueMapper: (element) =>
                                    truncateNumber(element.totalStake, 'thousands'),
                                align: 'end',
                                isSticky: false,
                                key: 'totalStake',
                            },
                            {
                                displayName: "Operator's cut",
                                valueMapper: (element) => `${element.operatorsCut}%`,
                                align: 'end',
                                isSticky: false,
                                key: 'operatorsCut',
                            },
                            {
                                displayName: 'APY',
                                valueMapper: (element) => `${element.apy}%`,
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
    const sponsorships = useSponsorships()

    const noData = false

    return (
        <NetworkPageSegment title="My sponsorships" foot>
            <WalletPass resourceName="sponsorships">
                {noData ? (
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
                ) : (
                    <ScrollTableCore
                        elements={sponsorships}
                        columns={[
                            {
                                displayName: 'Stream ID',
                                valueMapper: (element) => (
                                    <StreamInfoCell>
                                        <span className="stream-id">
                                            {truncateStreamName(element.streamId)}
                                        </span>
                                        {element.streamDescription && (
                                            <span className="stream-description">
                                                {element.streamDescription}
                                            </span>
                                        )}
                                    </StreamInfoCell>
                                ),
                                align: 'start',
                                isSticky: true,
                                key: 'streamInfo',
                            },
                            {
                                displayName: 'DATA/day',
                                valueMapper: (element) => element.payoutPerDay,
                                align: 'start',
                                isSticky: false,
                                key: 'dataPerDay',
                            },
                            {
                                displayName: 'Operators',
                                valueMapper: (element) => element.operators,
                                align: 'end',
                                isSticky: false,
                                key: 'operators',
                            },
                            {
                                displayName: 'Staked',
                                valueMapper: (element) =>
                                    truncateNumber(
                                        Number(element.totalStake),
                                        'thousands',
                                    ),
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
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}
