import React from 'react'
import { EmptyState } from '~/components/EmptyState'
import emptyStateIcon from '~/shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '~/shared/assets/images/empty_state_icon@2x.png'
import { useCurrentChainFullName } from '~/utils/chains'

interface Props {
    noOwnProjects?: boolean
}

export default function NoProductsView({ noOwnProjects = false }: Props) {
    const fullChainName = useCurrentChainFullName()

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
                    <span>
                        You haven&apos;t created any projects on the {fullChainName} chain
                        yet
                    </span>
                </p>
            ) : (
                <p>
                    <span>We couldn&apos;t find anything to match your search</span>
                    <small>
                        You are on the {fullChainName} chain. Please try some different
                        keywords or switch chains.
                    </small>
                </p>
            )}
        </EmptyState>
    )
}
