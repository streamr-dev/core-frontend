// @flow

import React, { useCallback } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { withRouter } from 'react-router-dom'

import routes from '$routes'
import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import type { Filter } from '$userpages/flowtype/common-types'

type NoResultsViewProps = {
    onResetFilter: Function,
    filter: ?Filter,
}
type Props = NoResultsViewProps & {
    hasFilter: boolean,
}

const NoAddedSubscriptionsView = withRouter(({ history }) => {
    const handleLink = useCallback((event) => {
        event.stopPropagation()
        event.preventDefault()

        if (event.target.pathname) {
            history.push(event.target.pathname)
        }
    }, [history])

    return (
        /* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
        <EmptyState
            image={(
                <img
                    src={emptyStateIcon}
                    srcSet={`${emptyStateIcon2x} 2x`}
                    alt={I18n.t('error.notFound')}
                />
            )}
        >
            <Translate value="userpages.subscriptions.noAddedSubscriptions.title" />
            <div onClick={handleLink}>
                <Translate
                    value="userpages.subscriptions.noAddedSubscriptions.message"
                    tag="small"
                    marketPlaceLink={routes.marketplace.index()}
                    dangerousHTML
                />
            </div>
        </EmptyState>
        /* eslint-enable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
    )
})

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
                <Translate value="userpages.subscriptions.noSubscriptionsResult.clearFilters" />
            </Button>
        )}
    >
        <Translate value="userpages.subscriptions.noSubscriptionsResult.title" />
        <Translate value="userpages.subscriptions.noSubscriptionsResult.message" tag="small" />
    </EmptyState>
)

const NoSubscriptionsView = ({ hasFilter, ...rest }: Props) => {
    if (hasFilter) {
        return (
            <NoResultsView {...rest} />
        )
    }

    return <NoAddedSubscriptionsView />
}

export default NoSubscriptionsView
