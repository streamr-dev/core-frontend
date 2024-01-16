import React from 'react'
import { EmptyState } from '~/components/EmptyState'
import emptyStateIcon from '~/shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '~/shared/assets/images/empty_state_icon@2x.png'

interface Props {
    noOwnProjects?: boolean
}

export default function NoProductsView({ noOwnProjects = false }: Props) {
    return (
        <EmptyState
            image={
                <img
                    src={emptyStateIcon}
                    srcSet={`${emptyStateIcon2x} 2x`}
                    alt="Not found"
                />
            }
        >
            {noOwnProjects ? (
                <p>
                    <span>You haven&apos;t created any projects yet</span>
                </p>
            ) : (
                <p>
                    <span>We couldn&apos;t find anything to match your search</span>
                    <small>Please try some different keywords</small>
                </p>
            )}
        </EmptyState>
    )
}
