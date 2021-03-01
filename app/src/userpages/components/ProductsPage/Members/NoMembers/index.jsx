// @flow

import React from 'react'

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

const messages = {
    approve: {
        title: 'No one is waiting to join at the moment.',
        message: 'Get out there and promote it 🚀',
    },
    remove: {
        title: 'No one has joined yet.',
        message: 'Get out there and promote it 🚀',
    },
    rejected: {
        title: 'You haven\'t rejected any approvals yet.',
        message: 'Keep up the good work 👍',
    },
}

const NoDataUnionMembers = ({ filter }: NoDataUnionMembersProps) => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt="Not found"
            />
        )}
    >
        {!!filter && filter.id && messages[filter.id] && (
            <p>
                <span>{messages[filter.id].title}</span>
                <small>
                    {messages[filter.id].message}
                </small>
            </p>
        )}
    </EmptyState>
)

const NoResultsView = ({ onResetFilter }: NoResultsViewProps) => (
    <EmptyState
        image={(
            <img
                src={noResultIcon}
                srcSet={`${noResultemptyStateIcon2x} 2x`}
                alt="Not found"
            />
        )}
        link={(
            <Button
                kind="special"
                onClick={onResetFilter}
            >
                Clear filters
            </Button>
        )}
    >
        <p>
            <span>Nope, sorry!</span>
            <small>
                We couldn&apos;t find any members that match your search.
            </small>
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
