// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import type { Filter } from '$userpages/flowtype/common-types'

type NoDataUnionMembersProps = {
    filter: ?Filter,
}
type NoResultsViewProps = {
    onResetFilter: Function,
}
type Props = NoResultsViewProps & NoDataUnionMembersProps & {
    hasFilter: boolean,
}

const NoDataUnionMembers = ({ filter }: NoDataUnionMembersProps) => (
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
            <Translate value={`userpages.members.noDataUnionMembers.${(filter && filter.id) || ''}.title`} />
            <Translate
                value={`userpages.members.noDataUnionMembers.${(filter && filter.id) || ''}.message`}
                tag="small"
            />
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
                <Translate value="userpages.members.noDataUnionMembers.clearFilters" />
            </Button>
        )}
    >
        <p>
            <Translate value="userpages.members.noDataUnionMembersResult.title" />
            <Translate value="userpages.members.noDataUnionMembersResult.message" tag="small" />
        </p>
    </EmptyState>
)

const NoMembersView = ({ hasFilter, filter, ...rest }: Props) => {
    if (hasFilter) {
        return (
            <NoResultsView {...rest} />
        )
    }

    return <NoDataUnionMembers filter={filter} />
}

export default NoMembersView
