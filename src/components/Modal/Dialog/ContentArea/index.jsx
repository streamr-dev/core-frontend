// @flow

import React, { type Node } from 'react'

type Props = {
    children?: Node,
}

export const ContentArea = ({ children }: Props) => (
    <div>
        {React.Children.toArray(children)}
        <hr />
    </div>
)

export default ContentArea
