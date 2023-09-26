import React from 'react'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { TimePeriod, isTimePeriod } from '~/types'

export default function TimePeriodTabs({
    value = TimePeriod.SevenDays,
    onChange,
}: {
    value?: TimePeriod
    onChange?: (value: TimePeriod) => void
}) {
    return (
        <Tabs
            selection={value}
            onSelectionChange={(value) => {
                if (!isTimePeriod(value)) {
                    throw new Error('Invalid time period')
                }

                onChange?.(value)
            }}
        >
            <Tab id={TimePeriod.SevenDays}>7D</Tab>
            <Tab id={TimePeriod.OneMonth}>1M</Tab>
            <Tab id={TimePeriod.ThreeMonths}>3M</Tab>
            <Tab id={TimePeriod.OneYear}>1Y</Tab>
            <Tab id={TimePeriod.YearToDate}>YTD</Tab>
            <Tab id={TimePeriod.All}>ALL</Tab>
        </Tabs>
    )
}
