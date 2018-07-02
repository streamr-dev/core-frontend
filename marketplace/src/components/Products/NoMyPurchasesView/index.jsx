// @flow

import React from 'react'

import EmptyState from '../../EmptyState'
import { main } from '../../../links'

const NoProductsView = () => (
    <EmptyState
        image={(
            <img
                src="/assets/empty_state_icon.png"
                srcSet="/assets/empty_state_icon@2x.png 2x"
                alt=""
            />
        )}
        link={(
            <a href={main} className="btn btn-special">
                Go to marketplace
            </a>
        )}
    >
        You haven’t purchased or added any products yet.<br />
        Visit the Marketplace get started.
    </EmptyState>
)

export default NoProductsView
