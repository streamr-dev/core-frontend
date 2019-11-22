// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import { editor } from '$shared/../links'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import Button from '$shared/components/Button'

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
            <Button tag="a" href={editor.canvasEditor} kind="special">
                <Translate value="noMyProductsView.goToEditor" />
            </Button>
        )}
    >
        <Translate value="noMyProductsView.message" />
        <Translate value="noMyProductsView.hint" tag="small" />
    </EmptyState>
)

export default NoProductsView
