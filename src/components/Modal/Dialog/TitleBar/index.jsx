// @flow

import React from 'react'

export type Props = {
    children?: React$Node,
}

export const TitleBar = ({ children }: Props) => (
    <div>
        {React.Children.toArray(children)}
        <hr />
    </div>
)

export default TitleBar
