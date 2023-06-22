import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { MD, TABLET } from '$shared/utils/styled'
import { TimeSeriesGraph } from '$shared/components/TimeSeriesGraph'
import Tabs, { Tab } from '$shared/components/Tabs'
import { useWindowSize } from '$shared/hooks/useWindowSize'

export enum ChartPeriod {
    '7D' = '7D',
    '1M' = '1M',
    '3M' = '3M',
    '1Y' = '1Y',
    'YTD' = 'YTD',
    'ALL' = 'ALL',
}

type Props = {
    dataSources: { label: string; value: string }[]
    onDataSourceChange: (dataSource: string) => Promise<void>
    onPeriodChange: (period: ChartPeriod) => Promise<void>
    selectedDataSource: string
    selectedPeriod: ChartPeriod
    stats: { day: number; value: number }[]
}
export const NetworkChart: FunctionComponent<Props> = ({
    stats,
    dataSources,
    onDataSourceChange,
    onPeriodChange,
    selectedDataSource,
    selectedPeriod,
}) => {
    const [dataLoading, setDataLoading] = useState(false)
    const windowWidth = useWindowSize().width
    const isDesktop = windowWidth >= MD

    const handleDataSourceTabChange = useCallback(
        async (selection: string) => {
            setDataLoading(true)
            await onDataSourceChange(selection)
            setDataLoading(false)
        },
        [onDataSourceChange, setDataLoading],
    )

    const handlePeriodTabChange = useCallback(
        async (selection: string) => {
            setDataLoading(true)
            await onPeriodChange(selection as ChartPeriod)
            setDataLoading(false)
        },
        [onDataSourceChange, setDataLoading],
    )

    return (
        <ChartContainer>
            {isDesktop ? (
                <ChartDataSourceSelectorDesktop>
                    <Tabs
                        selection={selectedDataSource}
                        onSelectionChange={handleDataSourceTabChange}
                    >
                        {dataSources.map((dataSource, index) => {
                            return (
                                <Tab id={dataSource.value} key={index}>
                                    {dataSource.label}
                                </Tab>
                            )
                        })}
                    </Tabs>
                </ChartDataSourceSelectorDesktop>
            ) : (
                <ChartDataSourceSelectorMobile>
                    <Tabs
                        spreadEvenly={true}
                        selection={selectedDataSource}
                        onSelectionChange={handleDataSourceTabChange}
                    >
                        {dataSources.map((dataSource, index) => {
                            return (
                                <Tab id={dataSource.value} key={index}>
                                    {dataSource.label}
                                </Tab>
                            )
                        })}
                    </Tabs>
                </ChartDataSourceSelectorMobile>
            )}
            <Chart
                shownDays={7}
                graphData={stats.map((stat) => ({ x: stat.day, y: stat.value }))}
            />

            {isDesktop ? (
                <ChartPeriodSelectorDesktop>
                    <Tabs
                        selection={selectedPeriod}
                        onSelectionChange={handlePeriodTabChange}
                    >
                        {Object.keys(ChartPeriod).map((periodKey, index) => {
                            return (
                                <Tab id={ChartPeriod[periodKey]} key={index}>
                                    {ChartPeriod[periodKey]}
                                </Tab>
                            )
                        })}
                    </Tabs>
                </ChartPeriodSelectorDesktop>
            ) : (
                <ChartPeriodSelectorMobile>
                    <Tabs
                        spreadEvenly={true}
                        selection={selectedPeriod}
                        onSelectionChange={handlePeriodTabChange}
                    >
                        {Object.keys(ChartPeriod).map((periodKey, index) => {
                            return (
                                <Tab id={ChartPeriod[periodKey]} key={index}>
                                    {ChartPeriod[periodKey]}
                                </Tab>
                            )
                        })}
                    </Tabs>
                </ChartPeriodSelectorMobile>
            )}
        </ChartContainer>
    )
}

const ChartContainer = styled.div`
    display: grid;
    grid-template-columns: min-content;
    grid-template-rows: min-content min-content min-content;
    @media (${TABLET}) {
        grid-template-columns: min-content 1fr min-content;
        grid-template-rows: min-content min-content;
    }
`

const ChartPeriodSelectorDesktop = styled.div`
    grid-column-start: 3;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 1;
    margin-bottom: 50px;
`

const ChartPeriodSelectorMobile = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 3;
    grid-row-end: 3;
    margin-top: 20px;
    > * {
        width: 100%;
    }
`

const ChartDataSourceSelectorDesktop = styled.div`
    margin-bottom: 50px;
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 1;
    grid-row-end: 1;
`

const ChartDataSourceSelectorMobile = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 1;
    margin-bottom: 20px;
    > * {
        width: 100%;
    }
`

const Chart = styled(TimeSeriesGraph)`
    margin: 20px 0;
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 2;
    @media (${TABLET}) {
        grid-area: 2 / 1 / 3 / 4;
    }
`
