// @flow

import React from 'react'

import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'

const NoProductsView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt="Not found"
            />
        )}
    >
        <p>
            <span>
                We couldn&apos;t find anything to match your search
            </span>
            <small>
                Please try some different keywords
            </small>
        </p>
    </EmptyState>
)

export default NoProductsView
