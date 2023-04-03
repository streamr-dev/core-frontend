import React, { FunctionComponent, useCallback } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import { Filter } from '$userpages/types/common-types'
import routes from '$routes'
type NoResultsViewProps = {
    onResetFilter: (...args: Array<any>) => any
    filter: Filter | null | undefined
}
type Props = NoResultsViewProps & {
    hasFilter: boolean
}
const NoAddedSubscriptionsView = withRouter(({ history }) => {
    const handleLink = useCallback(
        (event) => {
            event.stopPropagation()
            event.preventDefault()

            if (event.target.pathname) {
                history.push(event.target.pathname)
            }
        },
        [history],
    )
    return (
        /* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
        <EmptyState image={<img src={emptyStateIcon} srcSet={`${emptyStateIcon2x} 2x`} alt="Not found" />}>
            <div onClick={handleLink}>
                <span>You haven&apos;t subscribed to any products yet</span>
                <small>
                    Visit the <Link to={routes.projects.index()}>The Hub</Link> to get started.
                </small>
            </div>
        </EmptyState>
        /* eslint-enable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
    )
})

const NoResultsView = ({ onResetFilter }: NoResultsViewProps) => (
    <EmptyState
        image={<img src={noResultIcon} srcSet={`${noResultemptyStateIcon2x} 2x`} alt="Not found" />}
        link={
            <Button kind="special" onClick={onResetFilter}>
                Clear filters
            </Button>
        }
    >
        <p>
            <span>No results.</span>
            <small>We couldn&apos;t find any products that match your search.</small>
        </p>
    </EmptyState>
)

const NoSubscriptionsView: FunctionComponent = ({ hasFilter, ...rest }: Props) => {
    if (hasFilter) {
        return <NoResultsView {...rest} />
    }

    return <NoAddedSubscriptionsView />
}

export default NoSubscriptionsView
