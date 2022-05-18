// @flow

import React from 'react'

import docsLinks from '$shared/../docsLinks'
import type { Filter } from '$userpages/flowtype/common-types'

import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'

type NoResultsViewProps = {
    onResetFilter: Function,
    filter: ?Filter,
}
type Props = NoResultsViewProps & {
    hasFilter: boolean,
}

const NoCreatedDataUnionsView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt="Not found"
            />
        )}
    >
        You haven&apos;t created any Data Unions
        <small>
            Learn how to create one in the <a href={docsLinks.dataUnions}>Docs</a>
        </small>
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
            <span>No results.</span>
            <small>
                We couldn&apos;t find any data unions that match your search.
            </small>
        </p>
    </EmptyState>
)

const NoDataUnionsView = ({ hasFilter, ...rest }: Props) => {
    if (hasFilter) {
        return (
            <NoResultsView {...rest} />
        )
    }

    return <NoCreatedDataUnionsView />
}

export default NoDataUnionsView
