// @flow

import React from 'react'
import MediaQuery from 'react-responsive'
import { md } from '@streamr/streamr-layout/breakpoints'

import NoProductsBaseView from '../NoProductsBaseView'
import styles from '../NoMyProductsView/noMyProductsView.pcss'
import { main } from '../../../links'

const NoProductsView = () => (
    <NoProductsBaseView>
        <p>You haven’t purchased or added any products yet.</p>
        <p>Visit the Marketplace get started.</p>
        <MediaQuery minDeviceWidth={md.min}>
            <div className={styles.spacing}>
                <a href={main} className="btn btn-special">
                    Go to marketplace
                </a>
            </div>
        </MediaQuery>
    </NoProductsBaseView>
)

export default NoProductsView
