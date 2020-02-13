// @flow

import React, { useMemo } from 'react'
import {
    XYPlot,
    LineSeries,
    XAxis,
    YAxis,
    HorizontalGridLines,
} from 'react-vis'
import '$app/node_modules/react-vis/dist/style.css'

import Spinner from '$shared/components/Spinner'

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
    if (dayCount < 10) {
        return scale.tickFormat(tickTotal, '%a %d')(value)
    }

    // Include month only for the first item and when month
    // changes.
    if (index === 0 || value.getDate() === 1) {
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
    width: number,
    height: number,
    isLoading?: boolean,
}

const TimeSeriesGraph = ({
    graphData,
    className,
    shownDays,
    width,
    height,
    isLoading,
}: Props) => {
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
        return ([min - 2, max])
    }, [graphData])

    return (
        <div className={className}>
            {isLoading && (
                <div
                    style={{
                        width,
                        height,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Spinner size="large" color="white" />
                </div>
            )}
            {!isLoading && (
                <XYPlot
                    xType="time"
                    width={width}
                    height={height}
                    /* We need margin to not clip axis labels */
                    margin={{
                        left: 0,
                        right: 50,
                    }}
                    yDomain={dataDomain}
                >
                    <HorizontalGridLines />
                    <LineSeries
                        curve={null}
                        color="#0324FF"
                        opacity={1}
                        strokeStyle="solid"
                        strokeWidth="4"
                        data={graphData}
                    />
                    <XAxis
                        hideLine
                        style={xAxisStyle}
                        tickTotal={7}
                        tickFormat={(value, index, scale, tickTotal) => formatXAxisTicks(value, index, scale, tickTotal, shownDays)}
                    />
                    <YAxis
                        hideLine
                        style={yAxisStyle}
                        position="middle"
                        orientation="right"
                    />
                </XYPlot>
            )}
        </div>
    )
}

TimeSeriesGraph.defaultProps = {
    width: 560,
    height: 250,
}

export default TimeSeriesGraph
