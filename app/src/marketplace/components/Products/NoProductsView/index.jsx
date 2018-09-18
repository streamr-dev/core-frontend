// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'

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
    >
        <Translate value="noProductsView.message" />
        <Translate value="noProductsView.keywordHint" tag="small" />
    </EmptyState>
)

export default NoProductsView
