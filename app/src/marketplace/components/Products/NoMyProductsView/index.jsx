// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'

import { newCanvas } from '../../../../../../marketplace/src/links'
import EmptyState from '../../EmptyState/index'
import emptyStateIcon from '../../../../../../marketplace/assets/empty_state_icon.png'
import emptyStateIcon2x from '../../../../../../marketplace/assets/empty_state_icon@2x.png'

const NoProductsView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt=""
            />
        )}
        link={(
            <a href={newCanvas} className="btn btn-special">
                <Translate value="noMyProductsView.goToEditor" />
            </a>
        )}
    >
        <Translate value="noMyProductsView.message" dangerousHTML />
    </EmptyState>
)

export default NoProductsView
