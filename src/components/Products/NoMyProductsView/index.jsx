// @flow

import React from 'react'

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
                Go to the editor
            </a>
        )}
    >
        You haven’t created any products yet.<br />
        Click + to make one, or check out<br />
        links below for some help.
    </EmptyState>
)

export default NoProductsView
