import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import { NoData } from '~/shared/components/NoData'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { COLORS, LAPTOP, MEDIUM, TABLET } from '~/shared/utils/styled'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { errorToast } from '~/utils/toast'
import { BN, BNish, toBN } from '~/utils/bn'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import { fromAtto } from '~/marketplace/utils/math'
import { OperatorActionBar } from '~/components/ActionBars/OperatorActionBar'
import { getOperatorStats } from '~/getters/getOperatorStats'
import NetworkPageSegment, { Pad, SegmentGrid } from '~/components/NetworkPageSegment'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { ChartPeriod } from '~/types'
import { StatCellContent, StatCellLabel } from '~/components/StatGrid'
import { Separator } from '~/components/Separator'
import { useEditSponsorshipFunding, useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { getDelegatedAmountForWallet, getDelegationFractionForWallet } from '~/getters'
import {
    invalidateActiveOperatorByIdQueries,
    useCollectEarnings,
    useForceUndelegate,
    useOperatorByIdQuery,
} from '~/hooks/operators'
import { OperatorChecklist } from '~/components/OperatorChecklist'
import routes from '~/routes'
import {
    NodesTable,
    OperatorNode,
    useSubmitNodeAddressesCallback,
} from '~/components/NodesTable'
import Spinner from '~/components/Spinner'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import {
    useCanCollectEarningsCallback,
    useUncollectedEarnings,
} from '~/shared/stores/uncollectedEarnings'
import { truncate } from '~/shared/utils/text'
import { useConfigValueFromChain } from '~/hooks'
import { Button } from '~/components/Button'
import { FundedUntilCell, StreamIdCell } from '~/components/Table'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { useSetBlockDependency } from '~/stores/blockNumberDependencies'
import { onIndexedBlock } from '~/utils/blocks'
import { LiveNodesTable } from '~/components/LiveNodesTable'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import { abbr, saveOperator } from '~/utils'
import SvgIcon from '~/shared/components/SvgIcon'
import { Hint } from '~/components/Hint'
import { useCurrentChainId } from '~/shared/stores/chain'
import { getCurrentChainId } from '~/getters/getCurrentChain'

const defaultChartData = []

const defaultPersistedNodes = []

export const SingleOperatorPage = () => {
    const operatorId = useParams().id

    const operatorQuery = useOperatorByIdQuery(operatorId)

    const operator = operatorQuery.data || null

    const walletAddress = useWalletAccount()

    const maxUndelegationQueueSeconds = useConfigValueFromChain('maxQueueSeconds')

    const slashingFraction = useConfigValueFromChain('slashingFraction')

    const minimumStakeWei = useConfigValueFromChain('minimumStakeWei')

    const isOwner =
        walletAddress && walletAddress.toLowerCase() === operator?.owner.toLowerCase()

    const canCollect = useCanCollectEarningsCallback()

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const [selectedDataSource, setSelectedDataSource] = useState<
        'totalValue' | 'cumulativeEarnings'
    >('cumulativeEarnings')

    const currentChainId = useCurrentChainId()

    const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(
        ChartPeriod.ThreeMonths,
    )

    const chartQuery = useQuery({
        queryKey: [
            'operatorChartQuery',
            currentChainId,
            operatorId,
            selectedPeriod,
            selectedDataSource,
        ],
        queryFn: async () => {
            try {
                if (!operatorId) {
                    return []
                }

                return await getOperatorStats(
                    currentChainId,
                    operatorId,
                    selectedPeriod,
                    selectedDataSource,
                    { force: true, ignoreToday: false },
                )
            } catch (e) {
                errorToast({ title: 'Could not load operator chart data' })
                return []
            }
        },
    })

    const { data: chartData = defaultChartData } = chartQuery

    const myDelegationAmount = useMemo(() => {
        if (!walletAddress || !operator) {
            return toBN(0)
        }

        return getDelegatedAmountForWallet(walletAddress, operator)
    }, [operator, walletAddress])

    const myDelegationPercentage = useMemo(() => {
        if (!walletAddress || !operator) {
            return toBN(0)
        }

        return getDelegationFractionForWallet(walletAddress, operator).multipliedBy(100)
    }, [walletAddress, operator])

    const chartLabel =
        selectedDataSource === 'cumulativeEarnings'
            ? 'Cumulative earnings'
            : 'Total stake'

    const { nodes: persistedNodes = defaultPersistedNodes } = operator || {}

    const [nodes, setNodes] = useState(persistedNodes)

    useEffect(() => void setNodes(persistedNodes), [persistedNodes])

    const [saveNodeAddresses, isSavingNodeAddresses] = useSubmitNodeAddressesCallback()

    const setBlockDependency = useSetBlockDependency()

    const heartbeats = useInterceptHeartbeats(operator?.id)

    const collectEarnings = useCollectEarnings()

    const forceUndelegate = useForceUndelegate()

    return (
        <Layout>
            <NetworkHelmet title="Operator" />
            <LoadingIndicator
                loading={operatorQuery.isLoading || operatorQuery.isFetching}
            />
            {!!operator && (
                <OperatorActionBar
                    operator={operator}
                    handleEdit={(currentOperator) => {
                        saveOperator(currentChainId, currentOperator)
                    }}
                />
            )}
            <LayoutColumn>
                {operator == null ? (
                    <>
                        {!(operatorQuery.isLoading || operatorQuery.isFetching) && (
                            <NoData firstLine="Operator not found." />
                        )}
                    </>
                ) : (
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
                                                        dataSource !== 'totalValue' &&
                                                        dataSource !==
                                                            'cumulativeEarnings'
                                                    ) {
                                                        return
                                                    }

                                                    setSelectedDataSource(dataSource)
                                                }}
                                            >
                                                <Tab id="cumulativeEarnings">
                                                    Cumulative earnings
                                                </Tab>
                                                <Tab id="totalValue">Total stake</Tab>
                                            </Tabs>
                                        }
                                    >
                                        <NetworkChart
                                            isLoading={
                                                chartQuery.isLoading ||
                                                chartQuery.isFetching
                                            }
                                            tooltipValuePrefix={chartLabel}
                                            graphData={chartData}
                                            xAxisDisplayFormatter={formatShortDate}
                                            yAxisAxisDisplayFormatter={abbr}
                                            tooltipLabelFormatter={formatLongDate}
                                            tooltipValueFormatter={(value) =>
                                                tooltipValueFormatter(value, tokenSymbol)
                                            }
                                        />
                                    </NetworkChartDisplay>
                                </Pad>
                            </NetworkPageSegment>
                            <div>
                                <SegmentGrid>
                                    <NetworkPageSegment
                                        title={isOwner ? 'My stake' : 'My delegation'}
                                    >
                                        {walletAddress ? (
                                            <>
                                                <DelegationCell>
                                                    <Pad>
                                                        <StatCellLabel>
                                                            Current stake
                                                        </StatCellLabel>
                                                        <StatCellContent>
                                                            {abbr(
                                                                fromAtto(
                                                                    myDelegationAmount,
                                                                ),
                                                            )}{' '}
                                                            {tokenSymbol}
                                                        </StatCellContent>
                                                    </Pad>
                                                </DelegationCell>
                                                <Separator />
                                                <DelegationCell>
                                                    <Pad>
                                                        <StatCellLabel>
                                                            Share of Operator&apos;s total
                                                            stake
                                                        </StatCellLabel>
                                                        <StatCellContent>
                                                            {myDelegationPercentage.toFixed(
                                                                0,
                                                            )}
                                                            %
                                                        </StatCellContent>
                                                    </Pad>
                                                </DelegationCell>
                                            </>
                                        ) : (
                                            <Pad>
                                                Connect your wallet to show your
                                                delegation.
                                            </Pad>
                                        )}
                                    </NetworkPageSegment>
                                    <NetworkPageSegment title="Operator status">
                                        <OperatorChecklist operatorId={operatorId} />
                                    </NetworkPageSegment>
                                </SegmentGrid>
                            </div>
                        </ChartGrid>
                        <NetworkPageSegment
                            foot
                            title={
                                <TitleWithCount>
                                    <span>Sponsorships</span>
                                    <Count>{operator.stakes.length}</Count>
                                </TitleWithCount>
                            }
                        >
                            <ScrollTable
                                elements={operator.stakes}
                                columns={[
                                    {
                                        displayName: 'Stream ID',
                                        valueMapper: ({ streamId }) => (
                                            <StreamIdCell streamId={streamId} />
                                        ),
                                        align: 'start',
                                        isSticky: true,
                                        key: 'streamId',
                                    },
                                    {
                                        displayName: 'Staked',
                                        valueMapper: (element) => {
                                            const minimumStakeReachTime = moment(
                                                (element.joinTimestamp +
                                                    element.minimumStakingPeriodSeconds) *
                                                    1000,
                                            )
                                            return (
                                                <>
                                                    {abbr(fromAtto(element.amountWei))}{' '}
                                                    {tokenSymbol}
                                                    {minimumStakeReachTime.isAfter(
                                                        Date.now(),
                                                    ) && (
                                                        <Tooltip
                                                            content={
                                                                <>
                                                                    Minimum stake period:{' '}
                                                                    {minimumStakeReachTime.fromNow(
                                                                        true,
                                                                    )}{' '}
                                                                    left
                                                                </>
                                                            }
                                                        >
                                                            <TooltipIconWrap
                                                                className="ml-1"
                                                                $color="#ADADAD"
                                                                $svgSize={{
                                                                    width: '18px',
                                                                    height: '18px',
                                                                }}
                                                            >
                                                                <SvgIcon name="lockClosed" />
                                                            </TooltipIconWrap>
                                                        </Tooltip>
                                                    )}
                                                </>
                                            )
                                        },
                                        align: 'start',
                                        isSticky: false,
                                        key: 'staked',
                                    },
                                    {
                                        displayName: 'APY',
                                        valueMapper: (element) =>
                                            `${element.spotAPY
                                                .multipliedBy(100)
                                                .toFixed(0)}%`,
                                        align: 'start',
                                        isSticky: false,
                                        key: 'apy',
                                    },
                                    {
                                        displayName: 'Funded until',
                                        valueMapper: (element) => (
                                            <FundedUntilCell
                                                projectedInsolvencyAt={
                                                    element.projectedInsolvencyAt
                                                }
                                                isPaying={element.isSponsorshipPaying}
                                            />
                                        ),
                                        align: 'start',
                                        isSticky: false,
                                        key: 'fundedUntil',
                                    },
                                    {
                                        displayName: 'Uncollected earnings',
                                        valueMapper: (element) => (
                                            <UncollectedEarnings
                                                operatorId={operatorId}
                                                sponsorshipId={element.sponsorshipId}
                                            />
                                        ),
                                        align: 'end',
                                        isSticky: false,
                                        key: 'earnings',
                                    },
                                ]}
                                linkMapper={({ sponsorshipId: id }) =>
                                    routes.network.sponsorship({ id })
                                }
                                actions={[
                                    (element) => ({
                                        displayName: 'Edit',
                                        disabled: !isOwner,
                                        async callback() {
                                            if (!operator) {
                                                return
                                            }

                                            editSponsorshipFunding({
                                                chainId: currentChainId,
                                                sponsorshipOrSponsorshipId:
                                                    element.sponsorshipId,
                                                operator,
                                            })
                                        },
                                    }),
                                    (element) => ({
                                        displayName: 'Collect earnings',
                                        callback() {
                                            if (!operatorId) {
                                                return
                                            }

                                            collectEarnings({
                                                chainId: currentChainId,
                                                operatorId,
                                                sponsorshipId: element.sponsorshipId,
                                            })
                                        },
                                        disabled: !canCollect(
                                            operatorId || '',
                                            element.sponsorshipId,
                                        ),
                                    }),
                                ]}
                            />
                        </NetworkPageSegment>
                        <NetworkPageSegment foot title="Undelegation queue">
                            <ScrollTable
                                elements={operator.queueEntries}
                                columns={[
                                    {
                                        displayName: 'Delegator address',
                                        valueMapper: (element) => (
                                            <>
                                                {truncate(element.delegator)}
                                                {element.delegator ===
                                                    walletAddress?.toLowerCase() && (
                                                    <Badge>You</Badge>
                                                )}
                                            </>
                                        ),
                                        align: 'start',
                                        isSticky: true,
                                        key: 'id',
                                    },
                                    {
                                        displayName: 'Amount',
                                        valueMapper: (element) => (
                                            <>
                                                {abbr(
                                                    fromAtto(
                                                        BN.min(
                                                            getDelegatedAmountForWallet(
                                                                element.delegator,
                                                                operator,
                                                            ),
                                                            element.amount,
                                                        ),
                                                    ),
                                                )}{' '}
                                                {tokenSymbol}
                                            </>
                                        ),
                                        align: 'end',
                                        isSticky: false,
                                        key: 'amount',
                                    },
                                    {
                                        displayName: 'Expiration date',
                                        valueMapper: (element) => {
                                            const expirationDate =
                                                getUndelegationExpirationDate(
                                                    element.date,
                                                    maxUndelegationQueueSeconds,
                                                )
                                            return (
                                                <WarningCell>
                                                    {expirationDate.format('YYYY-MM-DD')}
                                                    {expirationDate.isBefore(
                                                        Date.now(),
                                                    ) && (
                                                        <Tooltip
                                                            content={
                                                                <p>
                                                                    Payout time exceeded.
                                                                    You can force unstake
                                                                    now.
                                                                </p>
                                                            }
                                                        >
                                                            <TooltipIconWrap $color="#ff5c00">
                                                                <JiraFailedBuildStatusIcon label="Error" />
                                                            </TooltipIconWrap>
                                                        </Tooltip>
                                                    )}
                                                </WarningCell>
                                            )
                                        },
                                        align: 'start',
                                        isSticky: false,
                                        key: 'date',
                                    },
                                    {
                                        displayName: '',
                                        valueMapper: (element) => (
                                            <>
                                                {getUndelegationExpirationDate(
                                                    element.date,
                                                    maxUndelegationQueueSeconds,
                                                ).isBefore(Date.now()) && (
                                                    <Button
                                                        type="button"
                                                        kind="secondary"
                                                        onClick={() => {
                                                            forceUndelegate(
                                                                currentChainId,
                                                                operator,
                                                                element.amount,
                                                            )
                                                        }}
                                                    >
                                                        Force unstake
                                                    </Button>
                                                )}
                                            </>
                                        ),
                                        align: 'end',
                                        isSticky: false,
                                        key: 'actions',
                                    },
                                ]}
                            />
                        </NetworkPageSegment>
                        <NetworkPageSegment foot title="Slashing history">
                            <SlashingHistoryTableContainer>
                                <ScrollTable
                                    elements={operator.slashingEvents.sort(
                                        (a, b) => b.date - a.date,
                                    )}
                                    columns={[
                                        {
                                            displayName: 'Stream ID',
                                            valueMapper: ({ streamId }) => (
                                                <StreamIdCell streamId={streamId} />
                                            ),
                                            align: 'start',
                                            isSticky: true,
                                            key: 'id',
                                        },
                                        {
                                            displayName: 'Date',
                                            valueMapper: (element) =>
                                                moment(element.date * 1000).format(
                                                    'YYYY-MM-DD HH:mm',
                                                ),
                                            align: 'start',
                                            isSticky: false,
                                            key: 'date',
                                        },
                                        {
                                            displayName: 'Slashed',
                                            valueMapper: (element) => (
                                                <>
                                                    {abbr(fromAtto(element.amount))}{' '}
                                                    {tokenSymbol}
                                                </>
                                            ),
                                            align: 'start',
                                            isSticky: false,
                                            key: 'slashed',
                                        },
                                        {
                                            displayName: 'Reason',
                                            valueMapper: (element) => {
                                                if (
                                                    slashingFraction == null ||
                                                    minimumStakeWei == null
                                                ) {
                                                    return ''
                                                }
                                                if (
                                                    element.amount.isLessThan(
                                                        fromAtto(
                                                            toBN(slashingFraction),
                                                        ).multipliedBy(
                                                            toBN(minimumStakeWei),
                                                        ),
                                                    )
                                                ) {
                                                    return 'False flag'
                                                }
                                                return 'Normal slashing'
                                            },
                                            align: 'start',
                                            isSticky: false,
                                            key: 'reason',
                                        },
                                    ]}
                                    linkMapper={({ sponsorshipId: id }) =>
                                        routes.network.sponsorship({ id })
                                    }
                                />
                            </SlashingHistoryTableContainer>
                        </NetworkPageSegment>
                        {isOwner && (
                            <NetworkPageSegment
                                title={
                                    <NodeAddressHeader>
                                        <span>Operator&apos;s node addresses</span>{' '}
                                        <div>
                                            <Hint>
                                                <p>
                                                    Your nodes need wallets for smart
                                                    contract interactions. Generate
                                                    Ethereum wallets using your tool of
                                                    choice, add the private key to your
                                                    node&apos;s config file, and add the
                                                    corresponding address here. You can
                                                    run multiple nodes with the same
                                                    address/private&nbsp;key.
                                                </p>
                                                <p>
                                                    Each node address should be supplied
                                                    with some MATIC on Polygon chain
                                                    for&nbsp;gas.
                                                </p>
                                            </Hint>
                                        </div>
                                    </NodeAddressHeader>
                                }
                            >
                                <NodesTable
                                    busy={isSavingNodeAddresses}
                                    value={nodes}
                                    onChange={setNodes}
                                    onSaveClick={async (addresses) => {
                                        if (!operatorId) {
                                            return
                                        }

                                        const chainId = getCurrentChainId()

                                        try {
                                            await saveNodeAddresses(
                                                chainId,
                                                operatorId,
                                                addresses,
                                                {
                                                    onSuccess(blockNumber) {
                                                        setNodes((current) => {
                                                            const newNodes: OperatorNode[] =
                                                                []

                                                            current.forEach((node) => {
                                                                if (node.enabled) {
                                                                    newNodes.push({
                                                                        ...node,
                                                                        persisted: true,
                                                                    })
                                                                }
                                                            })

                                                            return newNodes
                                                        })

                                                        setBlockDependency(
                                                            chainId,
                                                            blockNumber,
                                                            ['operatorNodes', operatorId],
                                                        )

                                                        onIndexedBlock(
                                                            chainId,
                                                            blockNumber,
                                                            () => {
                                                                invalidateActiveOperatorByIdQueries(
                                                                    chainId,
                                                                    operatorId,
                                                                )
                                                            },
                                                        )
                                                    },
                                                    onError() {
                                                        errorToast({
                                                            title: 'Faild to save the new node addresses',
                                                        })
                                                    },
                                                },
                                            )
                                        } catch (e) {}
                                    }}
                                />
                            </NetworkPageSegment>
                        )}
                        <NetworkPageSegment
                            title={
                                <TitleWithCount>
                                    <span>Live nodes</span>
                                    <Count>{Object.keys(heartbeats).length}</Count>
                                </TitleWithCount>
                            }
                        >
                            <LiveNodesTable heartbeats={heartbeats} />
                        </NetworkPageSegment>
                    </SegmentGrid>
                )}
            </LayoutColumn>
        </Layout>
    )
}

function tooltipValueFormatter(value: number, tokenSymbol: string) {
    return `${abbr(value)} ${tokenSymbol}`
}

function getUndelegationExpirationDate(
    date: number,
    maxUndelegationQueueSeconds: BNish | undefined = '0',
) {
    return moment((date + toBN(maxUndelegationQueueSeconds).toNumber()) * 1000)
}

const ChartGrid = styled(SegmentGrid)`
    grid-template-columns: minmax(0, 1fr);

    @media ${LAPTOP} {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
`

const DelegationCell = styled.div`
    ${Pad} {
        padding-bottom: 12px;
        padding-top: 12px;
    }

    @media ${TABLET} {
        ${StatCellLabel} {
            line-height: 24px;
        }

        ${StatCellContent} {
            font-size: 24px;
            line-height: 40px;
        }
    }
`

const Badge = styled.div`
    border-radius: 8px;
    background: ${COLORS.secondary};
    color: ${COLORS.primaryLight};
    font-size: 14px;
    font-weight: ${MEDIUM};
    line-height: 30px;
    letter-spacing: 0.14px;
    padding: 0px 10px;
    margin-left: 12px;
`

const TitleWithCount = styled.h2`
    display: flex;
    align-items: center;
`

const Count = styled.div`
    background-color: ${COLORS.secondary};
    border-radius: 50%;
    margin-left: 10px;
    width: 30px;
    font-size: 14px;
    text-align: center;
`

const NodeAddressHeader = styled.h2`
    display: flex;
    align-items: center;
`

const WarningCell = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;

    ${TooltipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`

const SlashingHistoryTableContainer = styled.div`
    max-height: none;

    @media ${LAPTOP} {
        max-height: 575px;
    }
`

function UncollectedEarnings({
    operatorId,
    sponsorshipId,
}: {
    operatorId: string | undefined
    sponsorshipId: string
}) {
    const value = useUncollectedEarnings(operatorId, sponsorshipId)

    return typeof value !== 'undefined' ? (
        <>
            {abbr(fromAtto(value?.uncollectedEarnings || 0))}{' '}
            <SponsorshipPaymentTokenName />
        </>
    ) : (
        <Spinner color="blue" />
    )
}
