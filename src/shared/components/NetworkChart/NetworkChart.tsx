import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { TABLET } from '~/shared/utils/styled'
import {
    TimeSeriesGraphProps,
    TimeSeriesGraph,
} from '~/shared/components/TimeSeriesGraph'
import Tabs, { Tab } from '~/shared/components/Tabs'
import UnstyledSpinner from '~/shared/components/Spinner'
import { ChartPeriod } from '~/types'

type Props = Omit<TimeSeriesGraphProps, 'isLoading'> & {
    dataSources: { label: string; value: string }[]
    onDataSourceChange: (dataSource: string) => void
    onPeriodChange: (period: string) => void
    selectedDataSource: string
    selectedPeriod: ChartPeriod
    isLoading?: boolean
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
    isLoading = false,
}) => {
    return (
        <ChartContainer>
            <ChartDataSourceSelector>
                <Tabs
                    fullWidthOnMobile={true}
                    selection={selectedDataSource}
                    onSelectionChange={onDataSourceChange}
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
                isLoading={isLoading}
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
                    onSelectionChange={onPeriodChange}
                    smallPadding={true}
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
