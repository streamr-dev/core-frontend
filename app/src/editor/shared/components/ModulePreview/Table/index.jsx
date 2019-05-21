// @flow

import React from 'react'

type Props = {
    height: number,
    width: number,
}

const Table = ({ width, height, ...props }: Props) => (
    <svg
        {...props}
        height={Math.floor((height + 4) / 8) * 8} // 8px per row; we don't wanna cut rows in half.
        width={width - 6}
        x={3}
    >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="paragraph" width="100%" height="16" patternUnits="userSpaceOnUse">
                    <g fill="#d8d8d8">
                        <rect width="15" rx="1" height="4" />
                        <rect width="19" rx="1" height="4" y="8" />
                        <rect width="19" rx="1" height="4" x="26" />
                        <rect width="24" rx="1" height="4" x="26" y="8" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#paragraph)" />
        </svg>
    </svg>
)

export default Table
