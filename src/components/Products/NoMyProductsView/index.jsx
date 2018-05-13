// @flow

import React from 'react'
import MediaQuery from 'react-responsive'
import { md } from '@streamr/streamr-layout/breakpoints'
import { newCanvas } from '../../../links'

import NoProductsBaseView from '../NoProductsBaseView'
import styles from './noMyProductsView.pcss'

const NoProductsView = () => (
    <NoProductsBaseView>
        <p>You haven’t created any products yet.</p>
        <p>Click + to make one, or check out <br /> links below for some help.</p>
        <MediaQuery minDeviceWidth={md.min}>
            <div className={styles.spacing}>
                <a href={newCanvas} className="btn-special">
                    Go to editor
                </a>
            </div>
        </MediaQuery>
    </NoProductsBaseView>
)

export default NoProductsView
