import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
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
import { truncateNumber } from '~/shared/utils/truncateNumber'
import { errorToast } from '~/utils/toast'
import { BN } from '~/utils/bn'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useOperator } from '~/hooks/useOperator'
import { fromAtto } from '~/marketplace/utils/math'
import { OperatorActionBar } from '~/components/ActionBars/OperatorActionBar'
import Button from '~/shared/components/Button'
import { getDelegationAmountForAddress } from '~/utils/delegation'
import { OperatorElement } from '~/types/operator'
import { updateOperator } from '~/services/operators'
import BecomeOperatorModal from '~/modals/BecomeOperatorModal'
import AddNodeAddressModal from '~/modals/AddNodeAddressModal'
import { useOperatorStore } from '~/shared/stores/operator'
import { Layer } from '~/utils/Layer'
import Spinner from '~/shared/components/Spinner'
import SvgIcon from '~/shared/components/SvgIcon'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import useTokenInfo from '~/hooks/useTokenInfo'
import { defaultChainConfig } from '~/getters/getChainConfig'
import getCoreConfig from '~/getters/getCoreConfig'
import { getOperatorStats } from '~/getters/getOperatorStats'
import NetworkPageSegment, { Pad, SegmentGrid } from '~/components/NetworkPageSegment'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { ChartPeriod } from '~/types'
import { StatCellBody, StatCellLabel } from '~/components/StatGrid'

const becomeOperatorModal = toaster(BecomeOperatorModal, Layer.Modal)
const addNodeAddressModal = toaster(AddNodeAddressModal, Layer.Modal)

const PendingIndicator = ({ title, onClick }: { title: string; onClick: () => void }) => (
    <PendingIndicatorContainer>
        <span>{title}</span>
        <PendingSeparator />
        <PendingCloseButton onClick={onClick}>
            <SvgIcon name="crossMedium" />
        </PendingCloseButton>
    </PendingIndicatorContainer>
)

export const SingleOperatorPage = () => {
    const operatorId = useParams().id
    const operatorQuery = useOperator(operatorId || '')
    const operator = operatorQuery.data
    const walletAddress = useWalletAccount()
    const {
        setOperator,
        addNodeAddress,
        removeNodeAddress,
        cancelAdd,
        cancelRemove,
        addedNodeAddresses,
        removedNodeAddresses,
        persistNodeAddresses,
        computed,
        isBusy,
    } = useOperatorStore()

    const tokenInfo = useTokenInfo(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        defaultChainConfig.id,
    )
    const tokenSymbol = tokenInfo?.symbol || 'DATA'

    useEffect(() => {
        setOperator(operator)
    }, [operator, setOperator])

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
                return await getOperatorStats(
                    operatorId as string,
                    selectedPeriod as ChartPeriod,
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
        return getDelegationAmountForAddress(walletAddress, operator)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [operator, walletAddress, operator?.valueWithoutEarnings])

    const myDelegationPercentage = useMemo(() => {
        if (myDelegationAmount.isZero()) {
            return 0
        }
        const myShare = myDelegationAmount.dividedBy(operator?.valueWithoutEarnings || 1)
        return myShare.multipliedBy(100)
    }, [operator, myDelegationAmount])

    const handleOperatorEdit = async (currentOperator: OperatorElement) => {
        try {
            await becomeOperatorModal.pop({
                title: 'Edit operator',
                cut: currentOperator.operatorsCutFraction.toNumber(),
                name: currentOperator.metadata?.name,
                description: currentOperator.metadata?.description,
                imageUrl: currentOperator.metadata?.imageUrl,
                redundancyFactor: currentOperator.metadata?.redundancyFactor,
                submitLabel: 'Save',
                onSubmit: async (
                    cut: number,
                    name: string,
                    redundancyFactor: number,
                    description?: string,
                    imageToUpload?: File,
                ) => {
                    await updateOperator(
                        currentOperator,
                        name,
                        redundancyFactor,
                        description,
                        imageToUpload,
                        cut,
                    )
                },
            })
            await waitForGraphSync()
            await operatorQuery.refetch()
        } catch (e) {
            // Ignore for now.
        }
    }

    const chartLabel =
        selectedDataSource === 'cumulativeEarnings'
            ? 'Cumulative earnings'
            : 'Total value'

    return (
        <Layout>
            <NetworkHelmet title="Operator" />
            <LoadingIndicator
                loading={operatorQuery.isLoading || operatorQuery.isFetching}
            />
            {!!operator && (
                <OperatorActionBar
                    operator={operator}
                    handleEdit={handleOperatorEdit}
                    onDelegationChange={() => operatorQuery.refetch()}
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
                            <NetworkPageSegment title="My delegation">
                                {walletAddress ? (
                                    <>
                                        <DelegationCell>
                                            <Pad>
                                                <StatCellLabel>
                                                    Current value
                                                </StatCellLabel>
                                                <StatCellBody>
                                                    {fromAtto(
                                                        myDelegationAmount,
                                                    ).toString()}
                                                </StatCellBody>
                                            </Pad>
                                        </DelegationCell>
                                        <hr />
                                        <DelegationCell>
                                            <Pad>
                                                <StatCellLabel>
                                                    Share of operator&apos;s total value
                                                </StatCellLabel>
                                                <StatCellBody>
                                                    {`${myDelegationPercentage.toFixed(
                                                        0,
                                                    )}%`}
                                                </StatCellBody>
                                            </Pad>
                                        </DelegationCell>
                                    </>
                                ) : (
                                    <>Connect your wallet to show your delegation</>
                                )}
                            </NetworkPageSegment>
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
                                        valueMapper: (element) =>
                                            element.sponsorship?.stream?.id,
                                        align: 'start',
                                        isSticky: true,
                                        key: 'streamId',
                                    },
                                    {
                                        displayName: 'Staked',
                                        valueMapper: (element) =>
                                            fromAtto(element.amount).toString(),
                                        align: 'start',
                                        isSticky: false,
                                        key: 'staked',
                                    },
                                    {
                                        displayName: 'APY',
                                        valueMapper: (element) =>
                                            `${BN(element.sponsorship?.spotAPY)
                                                .multipliedBy(100)
                                                .toFixed(0)}%`,
                                        align: 'start',
                                        isSticky: false,
                                        key: 'apy',
                                    },
                                    {
                                        displayName: 'Funded until',
                                        valueMapper: (element) =>
                                            moment(
                                                element.sponsorship?.projectedInsolvency *
                                                    1000,
                                            ).format('YYYY-MM-DD'),
                                        align: 'start',
                                        isSticky: false,
                                        key: 'fundedUntil',
                                    },
                                ]}
                            />
                        </NetworkPageSegment>
                        <NetworkPageSegment foot title="Slashing history">
                            <ScrollTable
                                elements={operator.slashingEvents}
                                columns={[
                                    {
                                        displayName: 'Stream ID',
                                        valueMapper: (element) => element.streamId || '',
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
                                            fromAtto(element.amount).toString(),
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
                                <ScrollTable
                                    elements={computed.nodeAddresses}
                                    columns={[
                                        {
                                            displayName: 'Address',
                                            valueMapper: (element) => (
                                                <NodeAddress isAdded={element.isAdded}>
                                                    {element.address}
                                                </NodeAddress>
                                            ),
                                            align: 'start',
                                            isSticky: true,
                                            key: 'id',
                                        },
                                        {
                                            displayName: 'MATIC balance',
                                            valueMapper: (element) => (
                                                <>
                                                    {element.balance != null ? (
                                                        element.balance.toFixed(2)
                                                    ) : (
                                                        <Spinner color="blue" />
                                                    )}
                                                </>
                                            ),
                                            align: 'start',
                                            isSticky: false,
                                            key: 'balance',
                                        },
                                        {
                                            displayName: '',
                                            valueMapper: (element) => (
                                                <>
                                                    {element.isRemoved && (
                                                        <PendingIndicator
                                                            title="Pending deletion"
                                                            onClick={() =>
                                                                cancelRemove(
                                                                    element.address,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                    {element.isAdded && (
                                                        <PendingIndicator
                                                            title="Pending addition"
                                                            onClick={() =>
                                                                cancelAdd(element.address)
                                                            }
                                                        />
                                                    )}
                                                    {!element.isAdded &&
                                                        !element.isRemoved && (
                                                            <Button
                                                                kind="secondary"
                                                                onClick={() => {
                                                                    removeNodeAddress(
                                                                        element.address,
                                                                    )
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                </>
                                            ),
                                            align: 'end',
                                            isSticky: false,
                                            key: 'actions',
                                        },
                                    ]}
                                    footerComponent={
                                        <NodeAddressesFooter>
                                            <Button
                                                kind="secondary"
                                                onClick={() =>
                                                    addNodeAddressModal.pop({
                                                        onSubmit: async (address) => {
                                                            addNodeAddress(address)
                                                        },
                                                    })
                                                }
                                            >
                                                Add node address
                                            </Button>
                                            <Button
                                                kind="primary"
                                                onClick={() => persistNodeAddresses()}
                                                disabled={
                                                    (removedNodeAddresses.length === 0 &&
                                                        addedNodeAddresses.length ===
                                                            0) ||
                                                    isBusy
                                                }
                                                waiting={isBusy}
                                            >
                                                Save
                                            </Button>
                                        </NodeAddressesFooter>
                                    }
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
    return `${truncateNumber(value, 'thousands')} ${tokenSymbol}`
}

function yAxisAxisDisplayFormatter(value: number) {
    return truncateNumber(value, 'thousands')
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

        ${StatCellBody} {
            font-size: 24px;
            line-height: 40px;
        }
    }
`

const NodeAddressesFooter = styled.div`
    display: flex;
    justify-content: right;
    padding: 32px;
    gap: 10px;
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

const NodeAddress = styled.div<{ isAdded: boolean }>`
    color: ${({ isAdded }) => (isAdded ? '#a3a3a3' : '#525252')};
`

const PendingIndicatorContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    align-content: center;
    height: 32px;
    align-items: center;
    border-radius: 4px;
    background: #deebff;

    & span {
        padding: 8px;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
    }
`

const PendingSeparator = styled.div`
    border-left: 1px solid #d1dfff;
    height: 32px;
`

const PendingCloseButton = styled.div`
    color: ${COLORS.close};
    padding: 8px;
    cursor: pointer;

    & svg {
        width: 8px;
        height: 8px;
    }
`
