// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import EmptyState from '../../EmptyState'
import { main } from '../../../../links'
import emptyStateIcon from '../../../assets/empty_state_icon.png'
import emptyStateIcon2x from '../../../assets/empty_state_icon@2x.png'

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
            <a href={main} className="btn btn-special">
                <Translate value="noMyPurchasesView.goToMarketplace" />
            </a>
        )}
    >
        <Translate value="noMyPurchasesView.message" />
        <Translate value="noMyPurchasesView.hint" tag="small" />
    </EmptyState>
)

export default NoProductsView
