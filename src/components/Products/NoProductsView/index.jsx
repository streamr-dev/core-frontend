// @flow

import React from 'react'

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
    >
        We couldn’t find anything to match your search
        <small>Please try some different keywords.</small>
    </EmptyState>
)

export default NoProductsView
