// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'

const NoStreamsView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
    >
        <Translate value="userpages.streams.noStreams.title" />
        <Translate value="userpages.streams.noStreams.message" tag="small" />
    </EmptyState>
)

export default NoStreamsView
