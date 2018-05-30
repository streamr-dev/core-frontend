// @flow

import React from 'react'

import { newCanvas } from '../../../links'
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
