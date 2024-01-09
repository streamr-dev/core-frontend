import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    ReferenceLine,
} from 'recharts'
import Spinner from '~/components/Spinner'
import { COLORS, MEDIUM, REGULAR, TABLET } from '~/shared/utils/styled'
import { NoData } from '~/shared/components/NoData'

const Container = styled.div`
    position: relative;
`

const NoDataContainer = styled.div`
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const SpinnerContainer = styled.div`
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
`

type XY = {
    x: number // timestamp
    y: number
}
export type TimeSeriesGraphProps = {
    graphData: Array<XY>
    isLoading?: boolean
    xAxisDisplayFormatter?: (value: number) => string
    yAxisAxisDisplayFormatter?: (value: number) => string
    tooltipLabelFormatter?: (value: number) => string
    tooltipValueFormatter?: (value: number) => string
    tooltipValuePrefix: string
    noDataText?: string
}

const TimeSeriesGraph = ({
    graphData,
    isLoading,
    xAxisDisplayFormatter,
    yAxisAxisDisplayFormatter,
    tooltipLabelFormatter,
    tooltipValueFormatter,
    tooltipValuePrefix,
    noDataText,
    ...props
}: TimeSeriesGraphProps) => {
    const chartData = useMemo(() => graphData.sort((a, b) => a.x - b.x), [graphData])

    const [crossHairY, setCrossHairY] = useState<number | null>(null)
    const [crossHairX, setCrossHairX] = useState<number | null>(null)
    const updateCrossHairCoordinates = useCallback((xValue: number, yValue: number) => {
        setTimeout(() => {
            setCrossHairX(xValue)
            setCrossHairY(yValue)
        })
        // do not put anything in the dependencies array or it will cause endless rerendering cycle
    }, [])

    return (
        <Container {...props}>
            {!!isLoading && (
                <SpinnerContainer>
                    <Spinner size="large" color="blue" />
                </SpinnerContainer>
            )}
            {!isLoading && (!chartData || !chartData.length) && (
                <NoDataContainer>
                    <NoData width={250} firstLine={noDataText || 'Not enough data'} />
                </NoDataContainer>
            )}
            {!isLoading && chartData && chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <Line
                            type="linear"
                            dataKey="y"
                            stroke={COLORS.link}
                            dot={{ r: 4, stroke: COLORS.link }}
                            activeDot={{ stroke: 'white', fill: COLORS.link, r: 5 }}
                            isAnimationActive={false}
                        />
                        <CartesianGrid stroke={COLORS.dialogBorder} vertical={false} />
                        <XAxis
                            // domain={xAxisDataDomain}
                            dataKey="x"
                            scale="point"
                            tickFormatter={xAxisDisplayFormatter || undefined}
                            tickMargin={10}
                            tickLine={false}
                            stroke={COLORS.dialogBorder}
                            minTickGap={10}
                            tick={{ stroke: COLORS.primaryLight, fontWeight: 200 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            domain={['dataMin', 'dataMax']}
                            dataKey="y"
                            orientation="right"
                            tickMargin={10}
                            tickFormatter={yAxisAxisDisplayFormatter || undefined}
                            stroke={COLORS.dialogBorder}
                            tickLine={false}
                            tick={{ stroke: COLORS.primaryLight, fontWeight: 200 }}
                            interval="preserveStartEnd"
                        />
                        <Tooltip
                            cursor={
                                <CustomCursor
                                    setSelectedPointValues={updateCrossHairCoordinates}
                                />
                            }
                            content={
                                <CustomTooltip
                                    valuePrefix={tooltipValuePrefix}
                                    labelFormatter={tooltipLabelFormatter}
                                    valueFormatter={tooltipValueFormatter}
                                />
                            }
                        />
                        {crossHairY !== null && crossHairX !== null && (
                            <>
                                <ReferenceLine
                                    y={crossHairY}
                                    stroke={COLORS.primaryLight}
                                    strokeDasharray="4 1"
                                />
                                <ReferenceLine
                                    x={crossHairX}
                                    stroke={COLORS.primaryLight}
                                    strokeDasharray="4 1"
                                />
                            </>
                        )}
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Container>
    )
}

const CustomCursor = (props) => {
    const { setSelectedPointValues } = props

    if (props.payload) {
        setSelectedPointValues(props.payload[0].payload.x, props.payload[0].payload.y)
    }

    const setSelectedPointValuesRef = useRef(setSelectedPointValues)

    if (setSelectedPointValuesRef.current !== setSelectedPointValues) {
        setSelectedPointValuesRef.current = setSelectedPointValues
    }

    useEffect(() => {
        const { current } = setSelectedPointValuesRef

        return () => {
            current?.(null, null)
        }
    }, [])

    return <></>
}

const CustomTooltipContainer = styled.div`
    border-radius: 8px;
    padding: 12px;
    background-color: white;
    box-shadow: 0 8px 12px 0 #52525226;
    font-size: 14px;

    .label {
        color: ${COLORS.primary};
        margin-bottom: 5px;
        font-weight: ${REGULAR};
    }

    .value {
        font-weight: ${MEDIUM};
        color: ${COLORS.primary};
        margin-bottom: 0;
    }

    .value-prefix {
        color: ${COLORS.primaryDisabled};
        font-weight: ${REGULAR};
    }
`

const CustomTooltip = (props) => {
    const { active, payload, label, valuePrefix, labelFormatter, valueFormatter } = props
    return (
        active &&
        payload &&
        payload[0] && (
            <CustomTooltipContainer>
                <p className="label">{labelFormatter ? labelFormatter(label) : label}</p>
                <p className="value">
                    <span className="value-prefix">{valuePrefix}:</span>{' '}
                    {valueFormatter ? valueFormatter(payload[0].value) : payload[0].value}
                </p>
            </CustomTooltipContainer>
        )
    )
}

export const NetworkChart = styled(TimeSeriesGraph)`
    margin: 40px 0;

    @media ${TABLET} {
        margin: 64px 0 0;
    }
`
