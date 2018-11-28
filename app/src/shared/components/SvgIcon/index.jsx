// @flow

import React from 'react'

const sources = {
    back: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 14">
            <path stroke="#323232" strokeWidth="1.5" d="M7 13L1 7l6-6" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
