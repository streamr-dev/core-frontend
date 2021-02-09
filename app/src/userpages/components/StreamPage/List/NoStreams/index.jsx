// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import type { Filter } from '$userpages/flowtype/common-types'
import { LG } from '$shared/utils/styled'

type NoResultsViewProps = {
    onResetFilter: Function,
    filter: ?Filter,
}
type Props = NoResultsViewProps & {
    hasFilter: boolean,
}

const Message = styled(Translate)`
    && {
        display: none;

        @media (min-width: ${LG}px) {
            display: block;
        }
    }
`

const MobileMessage = styled(Translate)`
    && {
        display: block;

        @media (min-width: ${LG}px) {
            display: none;
        }
    }
`

const NoCreatedStreamsView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
    >
        <p>
            <Translate value="userpages.streams.noCreatedStreams.title" />
            <Message value="userpages.streams.noCreatedStreams.message" tag="small" />
            <MobileMessage value="userpages.streams.noCreatedStreams.messageMobile" tag="small" />
        </p>
    </EmptyState>
)

const NoResultsView = ({ onResetFilter }: NoResultsViewProps) => (
    <EmptyState
        image={(
            <img
                src={noResultIcon}
                srcSet={`${noResultemptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
        link={(
            <Button
                kind="special"
                onClick={onResetFilter}
            >
                <Translate value="userpages.streams.noStreamsResult.clearFilters" />
            </Button>
        )}
    >
        <p>
            <Translate value="userpages.streams.noStreamsResult.title" />
            <Translate value="userpages.streams.noStreamsResult.message" tag="small" />
        </p>
    </EmptyState>
)

const NoStreamsView = ({ hasFilter, ...rest }: Props) => {
    if (hasFilter) {
        return (
            <NoResultsView {...rest} />
        )
    }

    return <NoCreatedStreamsView />
}

export default NoStreamsView
