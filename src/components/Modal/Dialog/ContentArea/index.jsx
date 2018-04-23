// @flow

import React, { type Node } from 'react'

import style from './contentarea.pcss'

type Props = {
    children?: Node,
}

export const ContentArea = ({ children }: Props) => (
    <div className={style.modalContentArea}>
        {children}
    </div>
)

export default ContentArea
