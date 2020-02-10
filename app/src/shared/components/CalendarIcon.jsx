// @flow

import React from 'react'
import styled, { css } from 'styled-components'

type Props = {
    disabled?: boolean,
}

const UnstyledCalendarIcon = ({ disabled, ...props }: Props) => (
    <svg
        {...props}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#A3A3A3"
    >
        <g
            strokeWidth="1.5"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x=".75" y="3.75" width="22.5" height="19.5" rx="1.5" />
            <path d="M6.75 6V.75M17.25 6V.75M5.25 14.25h4.5v4.5h-4.5zM14.25 9.75v9M9.75 9.75h9v9h-9zM9.75 14.25h9" />
        </g>
    </svg>
)

/*
 * TODO(MR): Parent component (the one that renders CalendarIcon) should
 *           decide on its placement and margins.
 *           I'd consider padding and borders to still be part
 *           of a component. #fyi.
 */
const CalendarIcon = styled(UnstyledCalendarIcon)`
    bottom: 0;
    cursor: pointer;
    height: 24px;
    margin: 9px 2px;
    pointer-events: none;
    position: absolute;
    right: 8px;
    width: 24px;

    ${({ disabled }) => !!disabled && css`
        opacity: 0.5;
    `}
`

export default CalendarIcon
