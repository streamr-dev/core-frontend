// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import { newCanvas } from '../../../../links'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'

const NoProductsView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
        link={(
            <a href={newCanvas} className="btn btn-special">
                <Translate value="noMyProductsView.goToEditor" />
            </a>
        )}
    >
        <Translate value="noMyProductsView.message" />
        <Translate value="noMyProductsView.hint" tag="small" />
    </EmptyState>
)

export default NoProductsView
