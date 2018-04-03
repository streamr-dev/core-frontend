// @flow

import React from 'react'

type Props = {
    children?: React$Node,
}

export const ContentArea = ({ children }: Props) => (
    <div>
        {React.Children.toArray(children)}
        <hr />
    </div>
)

export default ContentArea
