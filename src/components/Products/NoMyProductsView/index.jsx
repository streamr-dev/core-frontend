// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import { newCanvas } from '../../../links'
import EmptyState from '../../EmptyState'
import emptyStateIcon from '../../../../assets/empty_state_icon.png'
import emptyStateIcon2x from '../../../../assets/empty_state_icon@2x.png'

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
