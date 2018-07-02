// @flow

import React from 'react'

import EmptyState from '../../EmptyState'

const NoProductsView = () => (
    <EmptyState
        image={(
            <img
                src="/assets/empty_state_icon.png"
                srcSet="/assets/empty_state_icon@2x.png 2x"
                alt=""
            />
        )}
    >
        We couldn’t find anything to match your search
        <small>Please try some different keywords.</small>
    </EmptyState>
)

export default NoProductsView
