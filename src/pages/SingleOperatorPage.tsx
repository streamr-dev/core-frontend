import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { WhiteBox, WhiteBoxPaddingStyles } from '~/shared/components/WhiteBox'
import { NetworkSectionTitle } from '~/components/NetworkSectionTitle'
import { ChartPeriod, NetworkChart } from '~/shared/components/NetworkChart/NetworkChart'
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
import { StatsLabel, StatsValue } from '~/shared/components/StatsBox/StatsBox'
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
import { NetworkChartWrap } from '../components/NetworkUtils'
import { getOperatorStats } from '../getters/getOperatorStats'
import { awaitGraphBlock } from '~/getters/awaitGraphBlock'

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

    useEffect(() => {
        setOperator(operator)
    }, [operator, setOperator])

    const [selectedDataSource, setSelectedDataSource] = useState<string>('totalValue')
    const [selectedPeriod, setSelectedPeriod] = useState<string>(ChartPeriod.SevenDays)

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

    const myDelegationAmount = useMemo(() => {
        return getDelegationAmountForAddress(walletAddress, operator)
    }, [operator, walletAddress])

    const myDelegationPercentage = useMemo(() => {
        if (myDelegationAmount.isZero()) {
            return 0
        }
        const myShare = myDelegationAmount.dividedBy(operator?.poolValue || 1)
        return myShare.multipliedBy(100)
    }, [operator, myDelegationAmount])

    const tooltipPrefix = useMemo(() => {
        switch (selectedDataSource) {
            case 'totalValue':
                return 'Total value'
            case 'cumulativeEarnings':
                return 'Cumulative earnings'
            default:
                return ''
        }
    }, [selectedDataSource])

    const formatTooltipValue = useCallback(
        (value: number) => {
            switch (selectedDataSource) {
                case 'totalValue':
                case 'cumulativeEarnings':
                    return truncateNumber(value, 'thousands') + ' DATA'
                default:
                    return ''
            }
        },
        [selectedDataSource],
    )

    const formatYAxisValue = useCallback(
        (value: number) => {
            switch (selectedDataSource) {
                case 'totalValue':
                case 'cumulativeEarnings':
                    return truncateNumber(value, 'thousands')
                default:
                    return ''
            }
        },
        [selectedDataSource],
    )

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
                    const blockNumber = await updateOperator(
                        currentOperator,
                        name,
                        redundancyFactor,
                        description,
                        imageToUpload,
                        cut,
                    )
                    await awaitGraphBlock(blockNumber)
                },
            })
            await operatorQuery.refetch()
        } catch (e) {
            // Ignore for now.
        }
    }

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
                    <OperatorGrid>
                        <ChartGrid>
                            <OverviewCharts>
                                <div className="title">
                                    <NetworkSectionTitle>
                                        Overview charts
                                    </NetworkSectionTitle>
                                </div>
                                <NetworkChartWrap>
                                    <NetworkChart
                                        graphData={chartQuery?.data || []}
                                        isLoading={
                                            chartQuery.isLoading || chartQuery.isFetching
                                        }
                                        tooltipValuePrefix={tooltipPrefix}
                                        dataSources={[
                                            { label: 'Total value', value: 'totalValue' },
                                            {
                                                label: 'Cumulative earnings',
                                                value: 'cumulativeEarnings',
                                            },
                                        ]}
                                        onDataSourceChange={setSelectedDataSource}
                                        onPeriodChange={setSelectedPeriod}
                                        selectedDataSource={selectedDataSource}
                                        selectedPeriod={selectedPeriod as ChartPeriod}
                                        xAxisDisplayFormatter={formatShortDate}
                                        yAxisAxisDisplayFormatter={formatYAxisValue}
                                        tooltipLabelFormatter={formatLongDate}
                                        tooltipValueFormatter={formatTooltipValue}
                                    />
                                </NetworkChartWrap>
                            </OverviewCharts>
                            <MyDelegationContainer>
                                <DelegationCell>
                                    <NetworkSectionTitle>
                                        My delegation
                                    </NetworkSectionTitle>
                                </DelegationCell>
                                <DelegationSeparator />
                                {walletAddress == null && (
                                    <DelegationCell>
                                        Connect your wallet to show your delegation
                                    </DelegationCell>
                                )}
                                {walletAddress != null && (
                                    <>
                                        <DelegationCell>
                                            <StatsLabel>Current value</StatsLabel>
                                            <StatsValue>
                                                {fromAtto(myDelegationAmount).toString()}
                                            </StatsValue>
                                        </DelegationCell>
                                        <DelegationSeparator />
                                        <DelegationCell>
                                            <StatsLabel>
                                                Share of operator&apos;s total value
                                            </StatsLabel>
                                            <StatsValue>
                                                {`${myDelegationPercentage.toFixed(0)}%`}
                                            </StatsValue>
                                        </DelegationCell>
                                    </>
                                )}
                            </MyDelegationContainer>
                        </ChartGrid>
                        <SponsorshipsTable>
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
                                title={
                                    <SponsorshipsTableTitle>
                                        <span>Sponsorships</span>
                                        <SponsorshipsCount>
                                            {operator.stakes.length}
                                        </SponsorshipsCount>
                                    </SponsorshipsTableTitle>
                                }
                            />
                        </SponsorshipsTable>
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
                            title="Slashing history"
                        />
                        {walletAddress?.toLowerCase() === operator.owner && (
                            <>
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
                                    title={
                                        <NodeAddressHeader>
                                            <span>Operator&apos;s node addresses</span>
                                            <Help align="center">
                                                <p>
                                                    Your nodes need wallets for smart
                                                    contract interactions. Generate
                                                    Ethereum wallets using your tool of
                                                    choice, add the private key to your
                                                    node&apos;s config file, and add the
                                                    corresponding address here. You can
                                                    run multiple nodes with the same
                                                    address/private key.
                                                    <br />
                                                    <br />
                                                    Each node address should be supplied
                                                    with some MATIC on Polygon chain for
                                                    gas.
                                                </p>
                                            </Help>
                                        </NodeAddressHeader>
                                    }
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
                            </>
                        )}
                    </OperatorGrid>
                )}
            </LayoutColumn>
        </Layout>
    )
}

const OperatorGrid = styled.div`
    display: grid;
    gap: 20px;
    margin-top: 20px;

    @media (${TABLET}) {
        margin-top: 60px;
    }
`

const ChartGrid = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: unset;
    grid-template-rows: auto;

    @media (${LAPTOP}) {
        grid-template-columns: 2fr 1fr;
        grid-template-rows: auto;
    }
`

const OverviewCharts = styled(WhiteBox)`
    .icon {
        height: 24px;
        color: ${COLORS.primary};
        cursor: pointer;
    }

    .title {
        ${WhiteBoxPaddingStyles};
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`

const MyDelegationContainer = styled(WhiteBox)`
    padding: 32px 0;
    height: fit-content;
`

const DelegationSeparator = styled.div`
    border-top: 1px solid #f5f5f5;
`

const DelegationCell = styled.div`
    padding: 18px 40px 26px 40px;
`

const SponsorshipsTable = styled.div``

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
