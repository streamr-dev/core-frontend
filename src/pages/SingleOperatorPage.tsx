import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import { NoData } from '~/shared/components/NoData'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { COLORS, LAPTOP, TABLET } from '~/shared/utils/styled'
import Help from '~/components/Help'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'
import { errorToast, successToast } from '~/utils/toast'
import { toBN } from '~/utils/bn'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import { fromAtto } from '~/marketplace/utils/math'
import { OperatorActionBar } from '~/components/ActionBars/OperatorActionBar'
import { updateOperator } from '~/services/operators'
import BecomeOperatorModal from '~/modals/BecomeOperatorModal'
import { Layer } from '~/utils/Layer'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
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
import { useOperatorByIdQuery } from '~/hooks/operators'
import { refetchQuery } from '~/utils'
import { isRejectionReason } from '~/modals/BaseModal'
import { OperatorChecklist } from '~/components/OperatorChecklist'
import { collectEarnings } from '~/services/sponsorships'
import routes from '~/routes'
import {
    NodesTable,
    OperatorNode,
    useSubmitNodeAddressesCallback,
} from '~/components/NodesTable'
import Spinner from '~/shared/components/Spinner'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import {
    useCanCollectEarningsCallback,
    useUncollectedEarnings,
    useUncollectedEarningsStore,
} from '~/shared/stores/uncollectedEarnings'
import { confirm } from '~/getters/confirm'
import { truncate } from '~/shared/utils/text'
import { Tip, TipIconWrap } from '~/components/Tip'

const becomeOperatorModal = toaster(BecomeOperatorModal, Layer.Modal)

export const SingleOperatorPage = () => {
    const operatorId = useParams().id

    const operatorQuery = useOperatorByIdQuery(operatorId)

    const operator = operatorQuery.data || null

    const walletAddress = useWalletAccount()

    const { fetch: fetchUncollectedEarnings } = useUncollectedEarningsStore()

    const isOwner =
        walletAddress && walletAddress.toLowerCase() === operator?.owner.toLowerCase()

    const canCollect = useCanCollectEarningsCallback()

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const [selectedDataSource, setSelectedDataSource] = useState<
        'totalValue' | 'cumulativeEarnings'
    >('totalValue')

    const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(
        ChartPeriod.SevenDays,
    )

    const chartQuery = useQuery({
        queryKey: ['operatorChartQuery', operatorId, selectedPeriod, selectedDataSource],
        queryFn: async () => {
            try {
                if (!operatorId) {
                    return []
                }

                return await getOperatorStats(
                    operatorId,
                    selectedPeriod,
                    selectedDataSource,
                    false, // ignore today
                )
            } catch (e) {
                errorToast({ title: 'Could not load operator chart data' })
                return []
            }
        },
    })

    const { data: chartData = [] } = chartQuery

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
            : 'Total value'

    const { nodes: persistedNodes = [] } = operator || {}

    const [nodes, setNodes] = useState(persistedNodes)

    useEffect(() => void setNodes(persistedNodes), [persistedNodes])

    const [saveNodeAddresses, isSavingNodeAddresses] = useSubmitNodeAddressesCallback()

    return (
        <Layout>
            <NetworkHelmet title="Operator" />
            <LoadingIndicator
                loading={operatorQuery.isLoading || operatorQuery.isFetching}
            />
            {!!operator && (
                <OperatorActionBar
                    operator={operator}
                    handleEdit={async (currentOperator) => {
                        const {
                            operatorsCut: cut,
                            metadata: { name, description, imageUrl, redundancyFactor },
                        } = currentOperator

                        try {
                            await becomeOperatorModal.pop({
                                title: 'Edit operator',
                                cut,
                                name,
                                description,
                                imageUrl,
                                redundancyFactor,
                                submitLabel: 'Save',
                                async onSubmit(
                                    newCut,
                                    newName,
                                    newRedundancyFactor,
                                    newDescription,
                                    newImageToUpload,
                                ) {
                                    await updateOperator(operator, {
                                        cut: newCut,
                                        description: newDescription || '',
                                        imageToUpload: newImageToUpload,
                                        name: newName,
                                        redundancyFactor: newRedundancyFactor,
                                    })
                                },
                            })

                            await waitForGraphSync()

                            refetchQuery(operatorQuery)
                        } catch (e) {
                            if (!isRejectionReason(e)) {
                                throw e
                            }
                        }
                    }}
                    onDelegationChange={() => void refetchQuery(operatorQuery)}
                    tokenSymbol={tokenSymbol}
                />
            )}
            <LayoutColumn>
                {operator == null ? (
                    <>
                        {!(operatorQuery.isLoading || operatorQuery.isFetching) && (
                            <NoData firstLine={'Operator not found.'} />
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
                                                <Tab id="totalValue">Total value</Tab>
                                                <Tab id="cumulativeEarnings">
                                                    Cumulative earnings
                                                </Tab>
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
                                            yAxisAxisDisplayFormatter={
                                                yAxisAxisDisplayFormatter
                                            }
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
                                    <NetworkPageSegment title="My delegation">
                                        {walletAddress ? (
                                            <>
                                                <DelegationCell>
                                                    <Pad>
                                                        <StatCellLabel>
                                                            Current value
                                                        </StatCellLabel>
                                                        <StatCellContent>
                                                            {abbreviateNumber(
                                                                fromAtto(
                                                                    myDelegationAmount,
                                                                ).toNumber(),
                                                            )}{' '}
                                                            {tokenSymbol}
                                                        </StatCellContent>
                                                    </Pad>
                                                </DelegationCell>
                                                <Separator />
                                                <DelegationCell>
                                                    <Pad>
                                                        <StatCellLabel>
                                                            Share of operator&apos;s total
                                                            value
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
                                <SponsorshipsTableTitle>
                                    <span>Sponsorships</span>
                                    <SponsorshipsCount>
                                        {operator.stakes.length}
                                    </SponsorshipsCount>
                                </SponsorshipsTableTitle>
                            }
                        >
                            <ScrollTable
                                elements={operator.stakes}
                                columns={[
                                    {
                                        displayName: 'Stream ID',
                                        valueMapper: (element) => element.streamId,
                                        align: 'start',
                                        isSticky: true,
                                        key: 'streamId',
                                    },
                                    {
                                        displayName: 'Staked',
                                        valueMapper: (element) =>
                                            `${abbreviateNumber(
                                                fromAtto(element.amountWei).toNumber(),
                                            )} ${tokenSymbol}`,
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
                                        valueMapper: (element) => {
                                            const fundedUntil = moment(
                                                element.projectedInsolvencyAt * 1000,
                                            )

                                            return (
                                                <FundedUntil>
                                                    {fundedUntil.format('YYYY-MM-DD')}
                                                    {fundedUntil.isBefore(Date.now()) && (
                                                        <Tip
                                                            handle={
                                                                <TipIconWrap $color="#ff5c00">
                                                                    <JiraFailedBuildStatusIcon label="Error" />
                                                                </TipIconWrap>
                                                            }
                                                        >
                                                            Sponsorship expired
                                                        </Tip>
                                                    )}
                                                </FundedUntil>
                                            )
                                        },
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

                                            try {
                                                // Operator Stake entry is not the same as Sponsorship
                                                // so we need to do some massaging.
                                                const sponsorship = {
                                                    id: element.sponsorshipId,
                                                    minimumStakingPeriodSeconds:
                                                        element.minimumStakingPeriodSeconds,
                                                    stakes: [
                                                        {
                                                            amount: fromAtto(
                                                                element.amountWei,
                                                            ),
                                                            operatorId:
                                                                element.operatorId,
                                                            joinTimestamp:
                                                                element.joinTimestamp,
                                                            metadata: {
                                                                imageUrl: undefined,
                                                                imageIpfsCid: undefined,
                                                                redundancyFactor:
                                                                    undefined,
                                                                name: '',
                                                                description: '',
                                                            },
                                                        },
                                                    ],
                                                }

                                                await editSponsorshipFunding({
                                                    sponsorship,
                                                    operator,
                                                })

                                                await waitForGraphSync()
                                                refetchQuery(operatorQuery)
                                            } catch (e) {
                                                if (isRejectionReason(e)) {
                                                    return
                                                }

                                                console.warn(
                                                    'Could not edit a Sponsorship',
                                                    e,
                                                )
                                            }
                                        },
                                    }),
                                    (element) => ({
                                        displayName: 'Collect earnings',
                                        async callback() {
                                            if (operatorId) {
                                                try {
                                                    if (
                                                        !(await confirm({
                                                            cancelLabel: 'Cancel',
                                                            proceedLabel: 'Proceed',
                                                            title: 'Confirm',
                                                            description: (
                                                                <>
                                                                    This action transfers
                                                                    uncollected earnings
                                                                    to the Operator
                                                                    contract (
                                                                    {truncate(operatorId)}
                                                                    ).
                                                                </>
                                                            ),
                                                        }))
                                                    ) {
                                                        return
                                                    }

                                                    await collectEarnings(
                                                        element.sponsorshipId,
                                                        operatorId,
                                                    )

                                                    successToast({
                                                        title: 'Earnings collected!',
                                                        autoCloseAfter: 5,
                                                        desc: (
                                                            <p>
                                                                Earnings have been
                                                                successfully collected and
                                                                are now available in the
                                                                Operator&nbsp;balance.
                                                            </p>
                                                        ),
                                                    })

                                                    await fetchUncollectedEarnings(
                                                        operatorId,
                                                    )

                                                    await waitForGraphSync()

                                                    refetchQuery(operatorQuery)
                                                } catch (e) {
                                                    console.error(
                                                        'Could not collect earnings',
                                                        e,
                                                    )
                                                }
                                            }
                                        },
                                        disabled: !canCollect(
                                            operatorId || '',
                                            element.sponsorshipId,
                                        ),
                                    }),
                                ]}
                            />
                        </NetworkPageSegment>
                        <NetworkPageSegment foot title="Slashing history">
                            <ScrollTable
                                elements={operator.slashingEvents}
                                columns={[
                                    {
                                        displayName: 'Stream ID',
                                        valueMapper: (element) => element.streamId,
                                        align: 'start',
                                        isSticky: true,
                                        key: 'id',
                                    },
                                    {
                                        displayName: 'Date',
                                        valueMapper: (element) =>
                                            moment(element.date).format('YYYY-MM-DD'),
                                        align: 'start',
                                        isSticky: false,
                                        key: 'date',
                                    },
                                    {
                                        displayName: 'Slashed',
                                        valueMapper: (element) =>
                                            `${abbreviateNumber(
                                                fromAtto(element.amount).toNumber(),
                                            )} ${tokenSymbol}`,
                                        align: 'start',
                                        isSticky: false,
                                        key: 'slashed',
                                    },
                                ]}
                            />
                        </NetworkPageSegment>
                        {walletAddress?.toLowerCase() === operator.owner && (
                            <NetworkPageSegment
                                title={
                                    <NodeAddressHeader>
                                        <span>Operator&apos;s node addresses</span>
                                        <Help align="center">
                                            <p>
                                                Your nodes need wallets for smart contract
                                                interactions. Generate Ethereum wallets
                                                using your tool of choice, add the private
                                                key to your node&apos;s config file, and
                                                add the corresponding address here. You
                                                can run multiple nodes with the same
                                                address/private key.
                                                <br />
                                                <br />
                                                Each node address should be supplied with
                                                some MATIC on Polygon chain for gas.
                                            </p>
                                        </Help>
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

                                        try {
                                            await saveNodeAddresses(
                                                operatorId,
                                                addresses,
                                                {
                                                    onSuccess() {
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
                    </SegmentGrid>
                )}
            </LayoutColumn>
        </Layout>
    )
}

function tooltipValueFormatter(value: number, tokenSymbol: string) {
    return `${abbreviateNumber(value)} ${tokenSymbol}`
}

function yAxisAxisDisplayFormatter(value: number) {
    return abbreviateNumber(value)
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

const SponsorshipsTableTitle = styled.div`
    display: flex;
    align-items: center;
`

const SponsorshipsCount = styled.div`
    background-color: ${COLORS.secondary};
    border-radius: 50%;
    margin-left: 10px;
    width: 30px;
    font-size: 14px;
    text-align: center;
`

const NodeAddressHeader = styled.div`
    display: flex;
    align-items: center;
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
            {abbreviateNumber(fromAtto(value || '0').toNumber())}{' '}
            <SponsorshipPaymentTokenName />
        </>
    ) : (
        <Spinner color="blue" />
    )
}

const FundedUntil = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;

    ${TipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`
