// @flow

import React, { type Node } from 'react'

import image from '../../../../assets/empty_state_icon.png'
import styles from './noProductsBaseView.pcss'

type Props = {
    children: Node
}

const NoProductsBaseView = ({ children }: Props) => (
    <div className={styles.noProductsView}>
        <img src={image} alt="empty result" className={styles.img} />
        <div className={styles.content}>
            {children}
        </div>
    </div>
)

export default NoProductsBaseView
