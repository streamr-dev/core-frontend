import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { MD, TABLET } from '~/shared/utils/styled'
import { TimeSeriesGraphProps, TimeSeriesGraph } from '~/shared/components/TimeSeriesGraph'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { useWindowSize } from '~/shared/hooks/useWindowSize'
import UnstyledSpinner from '~/shared/components/Spinner'

export enum ChartPeriod {
    '7D' = '7D',
    '1M' = '1M',
    '3M' = '3M',
    '1Y' = '1Y',
    'YTD' = 'YTD',
    'ALL' = 'ALL',
}

type Props = Omit<TimeSeriesGraphProps, 'isLoading'> & {
    dataSources: { label: string; value: string }[]
    onDataSourceChange: (dataSource: string) => Promise<void>
    onPeriodChange: (period: ChartPeriod) => Promise<void>
    selectedDataSource: string
    selectedPeriod: ChartPeriod
}
export const NetworkChart: FunctionComponent<Props> = ({
    dataSources,
    onDataSourceChange,
    onPeriodChange,
    selectedDataSource,
    selectedPeriod,
    graphData,
    tooltipValuePrefix,
    xAxisDisplayFormatter,
    yAxisAxisDisplayFormatter,
    tooltipLabelFormatter,
    tooltipValueFormatter,
}) => {
    const [dataLoading, setDataLoading] = useState(false)

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
            <ChartDataSourceSelector>
                <Tabs
                    fullWidthOnMobile={true}
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
            </ChartDataSourceSelector>
            <Chart
                isLoading={dataLoading}
                graphData={graphData}
                tooltipValuePrefix={tooltipValuePrefix}
                xAxisDisplayFormatter={xAxisDisplayFormatter}
                yAxisAxisDisplayFormatter={yAxisAxisDisplayFormatter}
                tooltipLabelFormatter={tooltipLabelFormatter}
                tooltipValueFormatter={tooltipValueFormatter}
            />

            <ChartPeriodSelector>
                <Tabs
                    fullWidthOnMobile={true}
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
            </ChartPeriodSelector>
        </ChartContainer>
    )
}

const ChartContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, min-content);
    @media (${TABLET}) {
        grid-template-columns: min-content 1fr min-content;
        grid-template-rows: min-content min-content;
    }
`

const ChartPeriodSelector = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 3;
    grid-row-end: 3;
    margin-top: 20px;

    @media (${TABLET}) {
        grid-column-start: 3;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 1;
        margin-bottom: 50px;
        margin-top: 0;
    }
`

const ChartDataSourceSelector = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 1;
    margin-bottom: 20px;
    @media (${TABLET}) {
        margin-bottom: 50px;
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 1;
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
    transition: filter 100ms ease-in-out;
    &.blur {
        filter: blur(5px);
    }
`

const ChartSpinnerContainer = styled.div`
    background-color: #fff;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 2;
    @media (${TABLET}) {
        grid-area: 2 / 1 / 3 / 4;
    }
`

const Spinner = styled(UnstyledSpinner)`
    width: 100px;
    height: 100px;
`
