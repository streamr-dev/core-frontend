import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
    FlexibleXYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    LineMarkSeries,
    Borders,
    VerticalGridLines,
} from 'react-vis'
import Rect from '$shared/components/Rect'
import 'react-vis/dist/style.css'
import Spinner from '$shared/components/Spinner'
import { COLORS } from '$shared/utils/styled'
const PlotContainer = styled.div`
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
`
const Container = styled.div`
    position: relative;
`
const SpinnerContainer = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`
const xAxisStyle = {
    ticks: {
        fontSize: '12px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        strokeOpacity: '0',
        stroke: COLORS.primaryLight,
        opacity: '1',
        letterSpacing: '0px',
    },
    text: {
        strokeWidth: '0',
        textAnchor: 'start',
        fill: COLORS.primaryLight,
    },
}
const yAxisStyle = {
    ticks: {
        fontSize: '12px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        stroke: COLORS.primaryLight,
        strokeOpacity: '0',
        opacity: '1',
        letterSpacing: '0px',
    },
}

const gridLinesStyle = {
    stroke: COLORS.dialogBorder,
}

const borderStyle = {
    bottom: {
        height: '1',
        stroke: COLORS.dialogBorder,
    },
    left: {
        width: '1',
        stroke: COLORS.dialogBorder,
    },
    right: { width: '1', stroke: COLORS.dialogBorder },
    top: { stroke: COLORS.dialogBorder, padding: '10px', height: '1' },
}

const plotStyle = {
    overflow: 'visible',
}

const formatXAxisTicks = (value, index, scale, tickTotal, dayCount) => {
    // Show weekday name for small datasets
    if (dayCount < 5) {
        return scale.tickFormat(tickTotal, '%a %d')(value)
    }

    const previousTickDate = index > 0 ? scale.ticks()[index - 1] : null
    const monthChanged =
        previousTickDate != null
            ? new Date(value).getMonth() !== previousTickDate.getMonth()
            : false

    // Include month name only for the first item and when month changes
    if (index === 0 || monthChanged) {
        return scale.tickFormat(tickTotal, '%b %d')(value)
    }

    // Otherwise return only day number
    return scale.tickFormat(tickTotal, '%d')(value)
}

type XY = {
    x: number // timestamp
    y: number
}
type Props = {
    graphData: Array<XY>
    className?: string
    shownDays: number
    isLoading?: boolean
}

export const TimeSeriesGraph = ({ graphData, shownDays, isLoading, ...props }: Props) => {
    const dataDomain = useMemo(() => {
        const dataValues = (graphData || []).map((d) => d.y)
        let max = Math.max(...dataValues)
        let min = Math.min(...dataValues)

        // If we provide a domain with small difference, react-vis
        // shows seemingly random scale for y-axis
        if (Math.abs(max - min) < 2) {
            min -= 2
            max += 2
        }

        return [min, max]
    }, [graphData])
    // Adjust right margin so that it takes maximum Y value into account.
    // This way we'll have enough room for also larger numbers.
    const maxLength = Math.max(
        dataDomain[0].toString().length,
        dataDomain[1].toString().length,
    )
    const rightMargin = 12 + maxLength * 9
    return (
        <Container {...props}>
            {!!isLoading && (
                <SpinnerContainer>
                    <Spinner size="large" color="white" />
                </SpinnerContainer>
            )}
            {!isLoading && (
                <PlotContainer>
                    <FlexibleXYPlot
                        xType="time"
                        /* We need margin to not clip axis labels */
                        margin={{
                            left: 0,
                            right: rightMargin,
                            bottom: 24,
                        }}
                        yDomain={dataDomain}
                        yBaseValue={dataDomain[0]}
                        style={plotStyle}
                    >
                        <XAxis
                            hideLine
                            style={xAxisStyle}
                            tickTotal={shownDays}
                            tickFormat={(value, index, scale, tickTotal) =>
                                formatXAxisTicks(
                                    value,
                                    index,
                                    scale,
                                    tickTotal,
                                    shownDays,
                                )
                            }
                            tickSizeInner={0}
                            tickSizeOuter={0}
                        />
                        <YAxis
                            hideLine
                            style={yAxisStyle}
                            position="middle"
                            orientation="right"
                        />
                        <HorizontalGridLines style={gridLinesStyle} />
                        {/*<Borders style={borderStyle} />*/}
                        <LineMarkSeries
                            curve={null}
                            color={COLORS.link}
                            strokeStyle="solid"
                            strokeWidth="1"
                            data={graphData}
                            fill="#fff"
                        />
                    </FlexibleXYPlot>
                </PlotContainer>
            )}
            {/* This here is how we dictate the size of the container. */}
            <Rect ratio="5x2" />
        </Container>
    )
}
