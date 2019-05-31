// @flow

import React from 'react'

type Props = {
    height: number,
    width: number,
    y: number,
}

const Chart = ({ height, width, y }: Props) => {
    const chartHeight = height - 14
    const h = Math.floor(0.8 * chartHeight)

    return (
        <svg
            height={height}
            width={width}
            y={y}
        >
            <svg
                height={h}
                width="100%"
                y={Math.floor((chartHeight - h) / 2)}
            >
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern
                            height="66"
                            id="Chart-tile"
                            patternUnits="userSpaceOnUse"
                            width="112"
                        >
                            <path
                                // eslint-disable-next-line max-len
                                d="M0 53.167h3.004l4.05 3.404 7.623-9.428 3.387 6.286 3.388 9.428 1.482-3.143h5.293l3.6-3.143 3.176 6.286L36.697 66l3.387-6.286 5.082-18.857 1.693 6.286 3.388 9.428h3.176l3.811-3.142 1.906 3.142L62.316 44l3.599-18.857L68.879 0l1.694 6.286h1.906L75.654 22l1.694-6.286L79.254 22l1.482 15.714h3.6l3.175-9.428L90.9 22l1.694 3.143L94.43 27.5h1.693l3.306-3.725L102.002 33l2.515 1.841 2.38-5.15 1.736 17.452L112 53.167"
                                fill="none"
                                stroke="#FF5C00"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <svg viewBox="0 0 11200 66" preserveAspectRatio="xMinYMid slice">
                        <rect width="100%" height="100%" fill="url(#Chart-tile)" />
                    </svg>
                </svg>
            </svg>
            <rect
                fill="#EFEFEF"
                height="1"
                width="100%"
                y={height - 11}
            />
            <circle
                cx={4.5}
                cy={height - 5}
                r={1.5}
                fill="#FF5C00"
            />
            <rect
                fill="#D8D8D8"
                height="4"
                rx="1"
                width="23%"
                x="9"
                y={height - 7}
            />
        </svg>
    )
}

export default Chart
