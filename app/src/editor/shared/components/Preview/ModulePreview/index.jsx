// @flow

import React from 'react'
import Chart from './Chart'
import Comment from './Comment'
import Table from './Table'

type Props = {
    height: number,
    title: string,
    type: string,
    width: number,
    x: number,
    y: number,
}

const ModulePreview = ({
    height,
    title,
    type,
    width,
    x,
    y,
    ...props
}: Props) => (
    <svg
        {...props}
        height={height}
        width={width}
        x={x}
        y={y}
    >
        <rect
            fill={type === 'CommentModule' ? '#FAE7DD' : 'white'}
            height="100%"
            rx="1"
            width="100%"
        />
        <rect
            fill="#D8D8D8"
            height="4"
            rx="1"
            width={Math.min(width * 0.75, Math.max(title.length, 1) * 3)}
            x="3"
            y="3"
        />
        <rect
            fill="#EFEFEF"
            height="1"
            width="100%"
            y="10"
        />
        {type === 'streamr-chart' && (
            <Chart
                height={height - 14}
                width={width}
                y={14}
            />
        )}
        {type === 'streamr-table' && (
            <Table
                height={height - 17}
                width={width}
                y={14}
            />
        )}
        {type === 'CommentModule' && (
            <Comment
                height={height - 17}
                width={width}
                y={14}
            />
        )}
    </svg>
)

export default ModulePreview
