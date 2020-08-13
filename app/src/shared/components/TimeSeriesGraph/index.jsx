// @flow

import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
    FlexibleXYPlot,
    LineSeries,
    XAxis,
    YAxis,
    HorizontalGridLines,
} from 'react-vis'
import Rect from '$shared/components/Rect'
import '$app/node_modules/react-vis/dist/style.css'

import Spinner from '$shared/components/Spinner'

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

const xAxisStyle = {
    ticks: {
        fontSize: '12px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: '#A3A3A3',
        strokeOpacity: '1',
        stroke: '#A3A3A3',
        opacity: '0.5',
        letterSpacing: '0px',
    },
    text: {
        strokeWidth: '0',
        textAnchor: 'start',
    },
}

const yAxisStyle = {
    ticks: {
        fontSize: '12px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: '#A3A3A3',
        strokeOpacity: '0',
        opacity: '0.5',
        letterSpacing: '0px',
    },
}

const formatXAxisTicks = (value, index, scale, tickTotal, dayCount) => {
    // Show weekday name for small datasets
    if (dayCount < 5) {
        return scale.tickFormat(tickTotal, '%a %d')(value)
    }

    const previousTickDate = index > 0 ? scale.ticks()[index - 1] : null
    const monthChanged = previousTickDate != null ? new Date(value).getMonth() !== previousTickDate.getMonth() : false

    // Include month name only for the first item and when month changes
    if (index === 0 || monthChanged) {
        return scale.tickFormat(tickTotal, '%b %d')(value)
    }

    // Otherwise return only day number
    return scale.tickFormat(tickTotal, '%d')(value)
}

type XY = {
    x: any,
    y: any,
}

type Props = {
    graphData: Array<XY>,
    className?: string,
    shownDays: number,
    isLoading?: boolean,
}

const UnstyledTimeSeriesGraph = ({ graphData, shownDays, isLoading, ...props }: Props) => {
    const dataDomain = useMemo(() => {
        const dataValues = (graphData || []).map((d) => d.y)
        let max = Math.max(...dataValues)
        let min = Math.min(...dataValues)

        // If we provide a domain with same min and max, react-vis
        // shows seemingly random scale for y-axis
        if (max === min) {
            min -= 2
            max += 2
        }
        return ([min, max])
    }, [graphData])

    // Adjust right margin so that it takes maximum Y value into account.
    // This way we'll have enough room for also larger numbers.
    const maxLength = Math.max(dataDomain[0].toString().length, dataDomain[1].toString().length)
    const rightMargin = 12 + (maxLength * 9)

    return (
        <Container {...props}>
            {isLoading && (
                <Spinner
                    size="large"
                    color="white"
                    // eslint-disable-next-line react/jsx-curly-brace-presence
                    css={`
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                    `}
                />
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
                    >
                        <XAxis
                            hideLine
                            style={xAxisStyle}
                            tickTotal={7}
                            tickFormat={(value, index, scale, tickTotal) => formatXAxisTicks(value, index, scale, tickTotal, shownDays)}
                            tickSizeInner={0}
                            tickSizeOuter={6}
                        />
                        <YAxis
                            hideLine
                            style={yAxisStyle}
                            position="middle"
                            orientation="right"
                        />
                        <HorizontalGridLines />
                        <LineSeries
                            curve={null}
                            color="#0324FF"
                            opacity={1}
                            strokeStyle="solid"
                            strokeWidth="4"
                            data={graphData}
                        />
                    </FlexibleXYPlot>
                </PlotContainer>
            )}
            {/* This here is how we dictate the size of the container. */}
            <Rect ratio="5x2" />
        </Container>
    )
}

const TimeSeriesGraph = styled(UnstyledTimeSeriesGraph)``

export default TimeSeriesGraph
