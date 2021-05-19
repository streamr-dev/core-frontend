// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import type { Filter } from '$userpages/flowtype/common-types'
import { LG } from '$shared/utils/styled'
import docsLinks from '$shared/../docsLinks'

type NoResultsViewProps = {
    onResetFilter: Function,
    filter: ?Filter,
}
type Props = NoResultsViewProps & {
    hasFilter: boolean,
}

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

const NoCreatedProductsView = () => (
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
            <span>You haven&apos;t created any Data Products yet.</span>
            <Message>
                Click the Create button above to get started.
                <br />
                If you need help, see the <Link to={docsLinks.createProduct}>docs</Link>.
            </Message>
            <MobileMessage>
                Use the app in a desktop browser to create one.
            </MobileMessage>
        </p>
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
                We couldn&apos;t find any products that match your search.
            </small>
        </p>
    </EmptyState>
)

const NoProductsView = ({ hasFilter, ...rest }: Props) => {
    if (hasFilter) {
        return (
            <NoResultsView {...rest} />
        )
    }

    return <NoCreatedProductsView />
}

export default NoProductsView
