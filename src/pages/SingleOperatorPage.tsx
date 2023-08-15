import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styles from '~/marketplace/containers/Projects/projects.pcss'
import { NetworkHelmet } from '~/shared/components/Helmet'
import Layout, { PageContainer } from '~/shared/components/Layout'
import { NoData } from '~/shared/components/NoData'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { COLORS, LAPTOP, TABLET } from '~/shared/utils/styled'
import { WhiteBox, WhiteBoxPaddingStyles } from '~/shared/components/WhiteBox'
import { NetworkSectionTitle } from '~/components/NetworkSectionTitle'
import { HubAvatar } from '~/shared/components/AvatarImage'
import { truncate } from '~/shared/utils/text'
import Footer from '~/shared/components/Layout/Footer'
import { ChartPeriod, NetworkChart } from '~/shared/components/NetworkChart/NetworkChart'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import { errorToast } from '~/utils/toast'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { useSponsorshipFundingHistory } from '~/hooks/useSponsorshipFundingHistory'
import { useOperator } from '~/hooks/useOperator'
import { OperatorActionBar } from '~/components/ActionBars/OperatorActionBar'
import { NetworkChartWrap } from '../components/NetworkUtils'
import { getOperatorStats } from '../getters/getOperatorStats'

export const SingleOperatorPage = () => {
    const operatorId = useParams().id
    const operatorQuery = useOperator(operatorId || '')
    const operator = operatorQuery.data

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

    const fundingEventsQuery = useSponsorshipFundingHistory(operatorId)

    return (
        <Layout
            className={styles.projectsListPage}
            framedClassName={styles.productsFramed}
            innerClassName={styles.productsInner}
            footer={false}
        >
            <NetworkHelmet title="Operator" />
            <LoadingIndicator
                loading={operatorQuery.isLoading || operatorQuery.isFetching}
            />
            {!!operator && <OperatorActionBar operator={operator} />}
            <PageContainer>
                {operator == null ? (
                    <>
                        {!(operatorQuery.isLoading || operatorQuery.isFetching) && (
                            <NoData firstLine={'Operator not found.'} />
                        )}
                    </>
                ) : (
                    <SponsorshipGrid>
                        <OverviewCharts>
                            <div className="title">
                                <NetworkSectionTitle>Overview charts</NetworkSectionTitle>
                                {/*<SvgIcon
                                    name="fullScreen"
                                    className="icon"
                                    onClick={() => alert('open fullscreen mode')}
                                />*/}
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
                        <OperatorsContainer>
                            <ScrollTable
                                elements={operator.stakes}
                                columns={[
                                    {
                                        displayName: 'Operator ID',
                                        key: 'operatorId',
                                        isSticky: true,
                                        valueMapper: (stake) => (
                                            <OperatorCell>
                                                <HubAvatar id={stake.operatorId} />{' '}
                                                {truncate(stake.operatorId)}
                                            </OperatorCell>
                                        ),
                                        align: 'start',
                                    },
                                    {
                                        displayName: 'Staked',
                                        key: 'staked',
                                        isSticky: true,
                                        valueMapper: (stake) =>
                                            truncateNumber(
                                                Number(stake.amount),
                                                'thousands',
                                            ).toString(),
                                        align: 'end',
                                    },
                                ]}
                                title="Operators"
                            />
                        </OperatorsContainer>
                        <FundingHistory
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
                                        truncateNumber(
                                            Number(element.amount),
                                            'thousands',
                                        ),
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
                            title={'Funding history'}
                        />
                    </SponsorshipGrid>
                )}
            </PageContainer>
            <Footer />
        </Layout>
    )
}

const SponsorshipGrid = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
    grid-template-rows: min-content min-content min-content;
    margin-top: 20px;

    @media (${TABLET}) {
        margin-top: 60px;
    }

    @media (${LAPTOP}) {
        grid-template-columns: 66.66% 33.33%;
        grid-template-rows: max-content max-content;
    }
`

const OverviewCharts = styled(WhiteBox)`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 2;
    @media (${LAPTOP}) {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 2;
    }

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

const OperatorsContainer = styled.div`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
    @media (${LAPTOP}) {
        grid-column-start: 2;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 3;
    }
`

const OperatorCell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
`

const FundingHistory = styled(ScrollTable)`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 3;
    grid-row-end: 4;
    @media (${LAPTOP}) {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 2;
        grid-row-end: 3;
    }
`
