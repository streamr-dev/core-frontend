import React from 'react'
import Tabs, { Tab, Props as TabsProps } from '~/shared/components/Tabs'
import { ChartPeriod, isChartPeriod } from '~/types'

interface Props extends Omit<TabsProps, 'selected' | 'onSelectionChange' | 'onChange'> {
    value?: ChartPeriod
    onChange?: (value: ChartPeriod) => void
}

export function ChartPeriodTabs({
    value = ChartPeriod.SevenDays,
    onChange,
    ...rest
}: Props) {
    return (
        <Tabs
            {...rest}
            selection={value}
            onSelectionChange={(value) => {
                if (!isChartPeriod(value)) {
                    throw new Error('Invalid chart period')
                }

                onChange?.(value)
            }}
        >
            <Tab id={ChartPeriod.SevenDays}>7D</Tab>
            <Tab id={ChartPeriod.OneMonth}>1M</Tab>
            <Tab id={ChartPeriod.ThreeMonths}>3M</Tab>
            <Tab id={ChartPeriod.OneYear}>1Y</Tab>
            <Tab id={ChartPeriod.YearToDate}>YTD</Tab>
            <Tab id={ChartPeriod.All}>ALL</Tab>
        </Tabs>
    )
}
