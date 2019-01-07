// @flow

import React from 'react'

import UploadIcon from './ImageUploadIcon'

const sources = {
    back: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 14">
            <path stroke="#323232" strokeWidth="1.5" d="M7 13L1 7l6-6" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    caretUp: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 6">
            <path
                d="M1 5.245L5.245 1l4.243 4.243"
                stroke="#323232"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    caretDown: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 6">
            <path
                d="M9.488 1.243L5.243 5.488 1 1.245"
                stroke="#323232"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    tick: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8">
            <path
                d="M1.271 4.55l2.2 2.39 5.657-5.658"
                stroke="#323232"
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    imageUpload: (
        <UploadIcon />
    ),
}

type Props = {
    name: $Keys<typeof sources>,
}

const SvgIcon = ({ name, ...props }: Props) => React.cloneElement(sources[name], {
    ...props,
})

SvgIcon.names = Object.keys(sources).sort()

export default SvgIcon
