/* eslint-disable react/no-danger */
// @flow

import React from 'react'

type Props = {
    children: any,
    className?: any,
}

const RawHtml = ({ children, className = '' }: Props) => (
    <p
        className={className}
        dangerouslySetInnerHTML={{
            __html: children.replace(/\n/g, ' '),
        }}
    />
)

export default RawHtml
