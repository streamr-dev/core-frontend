// @flow

import React from 'react'

const sources = {
    back: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 20">
            <path fill="none" stroke="#323232" strokeWidth="3" d="M11 18.485L2.515 10 11 1.515" />
        </svg>
    ),
}

type Props = {
    source: $Keys<typeof sources>,
}

const SvgIcon = ({ className, source, ...props }: Props) => React.cloneElement(sources[source], {
    ...props,
})

export default SvgIcon
