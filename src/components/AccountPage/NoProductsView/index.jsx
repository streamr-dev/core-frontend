// @flow

import React from 'react'

import image from '../../../../assets/empty_state_icon.png'
import styles from './noProductsView.pcss'

const NoProductsView = () => (
    <div className={styles.noProductsView}>
        <img src={image} alt="empty icon" className={styles.img} />
        <div className={styles.content}>
            <p>You haven’t created any products yet.</p>
            <p>Click + to make one, or check out <br /> links below for some help.</p>
        </div>
        <div className={styles.spacing}>
            <a href="https://www.streamr.com/canvas/editor" className={styles.button}>
                Go to editor
            </a>
        </div>
    </div>
)

export default NoProductsView
