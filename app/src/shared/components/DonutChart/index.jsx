// @flow

import React, { useMemo } from 'react'
import cx from 'classnames'

import styles from './donutChart.pcss'

type Segment = {
    title: string,
    value: number,
    color: string,
}

type DonutSegment = {
    percentage: number,
    offset: number,
    color: string,
}

type Props = {
    className?: string,
    chartClassName?: string,
    data: Array<Segment>,
    strokeWidth: number,
    disabled?: boolean,
}

const CIRCLE_RADIUS = 50
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS
const DISABLED_COLOR = '#D8D8D8'

const calculateSegments = (parts: Array<Segment>) => {
    const segments = []
    let currentProgress = 0
    const valueSum = parts.reduce((acc, val) => acc + val.value, 0)

    parts.forEach((item) => {
        const val = valueSum !== 0 ? item.value / valueSum : 0
        segments.push({
            percentage: val,
            offset: currentProgress,
            color: item.color,
        })
        currentProgress += val
    })
    return segments
}

const renderLabels = (segments: Array<Segment>, disabled: boolean = false) => (
    segments.map((segment, index) => (
        <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={styles.label}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 10 10"
                className={styles.labelCircle}
            >
                <circle
                    cx="5"
                    cy="5"
                    r={4}
                    fill={!disabled ? segment.color : DISABLED_COLOR}
                    strokeWidth={1}
                    stroke={!disabled ? segment.color : DISABLED_COLOR}
                />
            </svg>
            {segment.title}
        </span>
    ))
)

const renderSegments = (segments: Array<DonutSegment>, strokeWidth: number) => (
    segments.map((segment, index) => (
        <circle
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS - strokeWidth}
            fill="transparent"
            strokeWidth={strokeWidth}
            stroke={segment.color}
            strokeDasharray={`${segment.percentage * CIRCLE_CIRCUMFERENCE} ${(1 - segment.percentage) * CIRCLE_CIRCUMFERENCE}`}
            strokeDashoffset={(1 - segment.offset) * CIRCLE_CIRCUMFERENCE}
            transform="rotate(-90 50 50)"
        />
    ))
)

const DonutChart = ({
    className,
    chartClassName,
    strokeWidth,
    data,
    disabled,
}: Props) => {
    const segments = useMemo(() => {
        if (disabled) {
            return []
        }
        return calculateSegments(data)
    }, [data, disabled])

    const renderedLabels = useMemo(() => renderLabels(data, disabled), [data, disabled])
    const renderedSegments = useMemo(() => (
        renderSegments(segments, strokeWidth)
    ), [segments, strokeWidth])

    const total = useMemo(() => {
        if (disabled) {
            return 0
        }

        return data.reduce((acc, val) => acc + val.value, 0)
    }, [data, disabled])

    return (
        <div className={cx(styles.root, className)}>
            <div className={cx(styles.donut, chartClassName)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r={CIRCLE_RADIUS - strokeWidth}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        stroke={DISABLED_COLOR}
                    />
                    {renderedSegments}
                </svg>
                <div className={styles.total}>
                    {total}
                </div>
            </div>
            <div className={styles.labelContainer}>
                {renderedLabels}
            </div>
        </div>
    )
}

export default DonutChart
