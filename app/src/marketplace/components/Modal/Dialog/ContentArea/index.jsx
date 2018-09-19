// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'

import style from './contentArea.pcss'

type Props = {
    children?: Node,
    className?: string,
}

export const ContentArea = ({ className, children }: Props) => (
    <div className={classNames(className, style.modalContentArea)}>
        {children}
    </div>
)

export default ContentArea
