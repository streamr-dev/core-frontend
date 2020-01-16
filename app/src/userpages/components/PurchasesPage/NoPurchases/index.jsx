// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

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

const NoAddedPurchasesView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
        link={(
            <Button kind="special" tag={Link} to={routes.marketplace()}>
                <Translate value="userpages.purchases.noAddedPurchases.hint" />
            </Button>
        )}
    >
        <Translate value="userpages.purchases.noAddedPurchases.title" />
        <Translate value="userpages.purchases.noAddedPurchases.message" tag="small" />
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
                <Translate value="userpages.purchases.noPurchasesResult.clearFilters" />
            </Button>
        )}
    >
        <Translate value="userpages.purchases.noPurchasesResult.title" />
        <Translate value="userpages.purchases.noPurchasesResult.message" tag="small" />
    </EmptyState>
)

const NoPurchasesView = ({ hasFilter, ...rest }: Props) => {
    if (hasFilter) {
        return (
            <NoResultsView {...rest} />
        )
    }

    return <NoAddedPurchasesView />
}

export default NoPurchasesView
