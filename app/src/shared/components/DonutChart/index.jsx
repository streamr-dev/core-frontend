// @flow

import React from 'react'
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
    data: Array<Segment>,
    strokeWidth: number,
}

const CIRCLE_RADIUS = 50
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

const DonutChart = ({ className, strokeWidth, data }: Props) => {
    const calculateSegments = (parts: Array<Segment>) => {
        const segments = []
        let currentProgress = 0
        const valueSum = parts.reduce((acc, val) => acc + val.value, 0)

        parts.forEach((item) => {
            const val = item.value / valueSum
            segments.push({
                percentage: val,
                offset: currentProgress,
                color: item.color,
            })
            currentProgress += val
        })
        return segments
    }

    const renderSegments = (segments: Array<DonutSegment>) => (
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

    const renderLabels = (segments: Array<Segment>) => (
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
                        fill={segment.color}
                        strokeWidth={1}
                        stroke={segment.color}
                    />
                </svg>
                {segment.title}
            </span>
        ))
    )

    return (
        <div className={cx(styles.root, className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
            >
                {renderSegments(calculateSegments(data))}
            </svg>
            <div className={styles.total}>
                {data.reduce((acc, val) => acc + val.value, 0)}
            </div>
            <div className={styles.labelContainer}>
                {renderLabels(data)}
            </div>
        </div>
    )
}

export default DonutChart
