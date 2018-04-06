// @flow

import React, { type Node } from 'react'

type Props = {
    children?: Node,
}

export const ContentArea = ({ children }: Props) => (
    <div>
        {children}
        <hr />
    </div>
)

export default ContentArea
