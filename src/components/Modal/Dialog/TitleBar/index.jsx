// @flow

import React, { type Node } from 'react'

export type Props = {
    children?: Node,
}

export const TitleBar = ({ children }: Props) => (
    <div>
        {children}
        <hr />
    </div>
)

export default TitleBar
