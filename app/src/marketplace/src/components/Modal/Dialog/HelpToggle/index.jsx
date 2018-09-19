// @flow

import React from 'react'
import style from './helptoggle.pcss'

export type Props = {
    active: boolean,
    onToggle: () => void,
}

export const HelpToggle = ({ active, onToggle }: Props) => (
    <button className={style.helpIcon} onClick={onToggle}>
        {!active ? <HelpIcon /> : <HelpCloseIcon />}
    </button>
)

export default HelpToggle

function HelpIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <path
                fill="#C3C3C3"
                fillRule="nonzero"
                d="M8 0C3.589 0 0 3.59 0 8c0 4.412
                3.589 8 8 8s8-3.588 8-8c0-4.41-3.589-8-8-8zm0 13a1 1 0 1 1 0-2 1 1 0 0
                1 0 2zm.8-3.5v.9H7.2V8H8a1.601 1.601 0 0 0 0-3.2 1.6 1.6 0 0 0-1.6
                1.6H4.8c0-1.764 1.436-3.2 3.2-3.2 1.764 0 3.2 1.436 3.2 3.2a3.208
                3.208 0 0 1-2.4 3.1z"
            />
        </svg>
    )
}

function HelpCloseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <g fill="none">
                <path
                    fill="#C3C3C3"
                    d="M8 0C3.589 0 0 3.59 0 8c0 4.412 3.589 8 8 8s8-3.588
                    8-8c0-4.41-3.589-8-8-8z"
                />
                <path
                    fill="#FFF"
                    d="M12 5.202L10.798 4 8 6.798 5.202 4 4 5.202 6.798 8 4 10.798 5.202
                    12 8 9.202 10.798 12 12 10.798 9.202 8z"
                />
            </g>
        </svg>
    )
}
