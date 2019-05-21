// @flow

import React from 'react'

type Props = {
    height: number,
}

const Comment = ({ height, ...props }: Props) => (
    <svg
        {...props}
        height={Math.floor((height + 4) / 8) * 8} // 8px per row; we don't wanna cut rows in half.
        width="75%"
        x={3}
    >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <g fill="#d8d8d8">
                <rect height="4" rx="1" width="100%" />
                <rect height="4" rx="1" width="55%" y="8" />
            </g>
        </svg>
    </svg>
)

export default Comment
