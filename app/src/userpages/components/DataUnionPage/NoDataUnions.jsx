// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import docsLinks from '$shared/../docsLinks'
import type { Filter } from '$userpages/flowtype/common-types'

type NoResultsViewProps = {
    onResetFilter: Function,
    filter: ?Filter,
}
type Props = NoResultsViewProps & {
    hasFilter: boolean,
}

const NoDataUnionsView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
    >
        <Translate value="userpages.dataunions.noCreatedDataUnions.title" />
        <Translate value="userpages.dataunions.noCreatedDataUnions.message" tag="small" dangerousHTML link={docsLinks.dataUnions} />
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
                <Translate value="userpages.dataunions.noDataUnionResult.clearFilters" />
            </Button>
        )}
    >
        <Translate value="userpages.dataunions.noDataUnionResult.title" />
        <Translate value="userpages.dataunions.noDataUnionResult.message" tag="small" />
    </EmptyState>
)

const NoDashboardsView = ({ hasFilter, ...rest }: Props) => {
    if (hasFilter) {
        return (
            <NoResultsView {...rest} />
        )
    }

    return <NoDataUnionsView />
}

export default NoDashboardsView
