// @flow

import React from 'react'

const sources = {
    default: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <circle stroke="#E7E7E7" strokeWidth="1.5" fill="#F8F8F8" cx="8" cy="8" r="7.25" />
                <circle fill="#E7E7E7" cx="8" cy="8" r="4" />
            </g>
        </svg>
    ),
    seen: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <circle stroke="#0324FF" strokeWidth="1.5" fill="#F8F8F8" cx="8" cy="8" r="7.25" />
                <circle fill="#E7E7E7" cx="8" cy="8" r="4" />
            </g>
        </svg>
    ),
    active: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <circle stroke="#0324FF" strokeWidth="1.5" fill="#F8F8F8" cx="8" cy="8" r="7.25" />
                <circle fill="#0324FF" cx="8" cy="8" r="4" />
            </g>
        </svg>
    ),
    activeError: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <circle stroke="#FF5C00" strokeWidth="1.5" fill="#F8F8F8" cx="8" cy="8" r="7.25" />
                <circle fill="#FF5C00" cx="8" cy="8" r="4" />
            </g>
        </svg>
    ),
    valid: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <g strokeWidth="1.5" stroke="#0324FF">
                    <circle cx="8" cy="8" r="7.25" fill="#F8F8F8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.306 8.19l1.65 1.792 4.243-4.243" />
                </g>
            </g>
        </svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <g strokeWidth="1.5" stroke="#FF5C00">
                    <circle fill="#F8F8F8" cx="8" cy="8" r="7.25" />
                    <path d="M8 5v3.918M7.986 10.904l.014.014" strokeLinecap="round" />
                </g>
            </g>
        </svg>
    ),
    unpublished: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd">
                <g stroke="#0324FF">
                    <circle strokeWidth="1.5" fill="#F8F8F8" cx="8" cy="8" r="7.25" />
                    <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
                        <path d="M10.762 5.612a3.638 3.638 0 00-6.35 2.426v.304M5.34 10.464a3.638 3.638 0 006.348-2.425v-.303" />
                        <path d="M10.779 8.644l.91-.91.909.91M5.322 7.431l-.91.91-.909-.91" />
                    </g>
                </g>
            </g>
        </svg>
    ),
}

export type IconName = $Keys<typeof sources>

type Props = {
    name: IconName,
}

const Icons = ({ name, ...props }: Props) => React.cloneElement(sources[name], {
    ...props,
})

export default Icons
