import React from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import { LG } from '$shared/utils/styled'

const Message = styled.small`
    && {
        display: none;

        @media (min-width: ${LG}px) {
            display: block;
        }
    }
`

const MobileMessage = styled.small`
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
                alt="Not found"
            />
        )}
    >
        <p>
            <span>You haven&apos;t created any streams yet.</span>
            <Message>
                Not what you expected? Your streams might be in the
                {' '}
                <a target="_blank" rel="nofollow noopener noreferrer" href="https://corea.streamr.network/">previous network</a>
                {' '}
                and can be migrated.
            </Message>
            <MobileMessage>
                Use the desktop app to make one.
            </MobileMessage>
        </p>
    </EmptyState>
)

const NoResultsView = ({ onClearFilterClick }) => (
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
                onClick={onClearFilterClick}
            >
                Clear filters
            </Button>
        )}
    >
        <p>
            <span>No results.</span>
            <small>
                We couldn&apos;t find any streams that match your search.
            </small>
        </p>
    </EmptyState>
)

export default function Zero({ filter, onClearFilterClick }) {
    return filter
        ? <NoResultsView onClearFilterClick={onClearFilterClick} />
        : <NoCreatedStreamsView />
}
