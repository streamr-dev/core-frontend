import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styles from '~/marketplace/containers/Projects/projects.pcss'
import { NetworkHelmet } from '~/shared/components/Helmet'
import Layout, { PageContainer } from '~/shared/components/Layout'
import { useSponsorship } from '~/network/hooks/useSponsorship'
import { NoData } from '~/shared/components/NoData'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { COLORS, LAPTOP, TABLET } from '~/shared/utils/styled'
import { WhiteBox, WhiteBoxPaddingStyles } from '~/shared/components/WhiteBox'
import { NetworkSectionTitle } from '~/network/components/NetworkSectionTitle'
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
import { SponsorshipActionBar } from '../components/ActionBars/SponsorshipActionBar'
import { NetworkChartWrap } from '../components/NetworkUtils'
import { useSponsorshipFundingHistory } from '../hooks/useSponsorshipFundingHistory'
import { getSponsorshipStats } from '../getters/getSponsorshipStats'

export const SingleSponsorshipPage = () => {
    const sponsorshipId = useParams().id
    const sponsorshipQuery = useSponsorship(sponsorshipId || '')
    const sponsorship = sponsorshipQuery.data

    const [selectedDataSource, setSelectedDataSource] = useState<string>('amountStaked')
    const [selectedPeriod, setSelectedPeriod] = useState<string>(ChartPeriod.SevenDays)

    const chartQuery = useQuery({
        queryKey: ['sponsorshipChartQuery', selectedPeriod, selectedDataSource],
        queryFn: async () => {
            try {
                return await getSponsorshipStats(
                    sponsorshipId as string,
                    selectedPeriod as ChartPeriod,
                    selectedDataSource,
                    false, // ignore today
                )
            } catch (e) {
                errorToast({ title: 'Could not load sponsorship chart data' })
                return []
            }
        },
    })

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
                    return truncateNumber(value, 'thousands') + ' DATA'
                case 'numberOfOperators':
                    return value.toString()
                case 'apy':
                    return value + '%'
                default:
                    return ''
            }
        },
        [selectedDataSource],
    )

    const formatYAxisValue = useCallback(
        (value: number) => {
            switch (selectedDataSource) {
                case 'amountStaked':
                    return truncateNumber(value, 'thousands')
                case 'numberOfOperators':
                    return value.toString()
                case 'apy':
                    return value + '%'
                default:
                    return ''
            }
        },
        [selectedDataSource],
    )

    const fundingEventsQuery = useSponsorshipFundingHistory(sponsorshipId)

    return (
        <Layout
            className={styles.projectsListPage}
            framedClassName={styles.productsFramed}
            innerClassName={styles.productsInner}
            footer={false}
        >
            <NetworkHelmet title="Sponsorship" />
            <LoadingIndicator
                loading={sponsorshipQuery.isLoading || sponsorshipQuery.isFetching}
            />
            {!!sponsorship && <SponsorshipActionBar sponsorship={sponsorship} />}
            <PageContainer>
                {sponsorship == null ? (
                    <>
                        {!(sponsorshipQuery.isLoading || sponsorshipQuery.isFetching) && (
                            <NoData firstLine={'Sponsorship not found.'} />
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
                                        { label: 'Amount staked', value: 'amountStaked' },
                                        {
                                            label: 'Number of operators',
                                            value: 'numberOfOperators',
                                        },
                                        { label: 'APY', value: 'apy' },
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
                                elements={sponsorship.stakes}
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
