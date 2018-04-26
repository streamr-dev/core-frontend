// @flow

import React from 'react'

import NoProductsBaseView from '../NoProductsBaseView'
import styles from './noMyProductsView.pcss'

const NoProductsView = () => (
    <NoProductsBaseView>
        <p>You haven’t created any products yet.</p>
        <p>Click + to make one, or check out <br /> links below for some help.</p>
        <div className={styles.spacing}>
            <a href="https://www.streamr.com/canvas/editor" className={styles.button}>
                Go to editor
            </a>
        </div>
    </NoProductsBaseView>
)

export default NoProductsView
