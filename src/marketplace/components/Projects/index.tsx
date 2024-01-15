import React from 'react'
import styled, { css } from 'styled-components'
import { MarketplaceProductTile } from '~/shared/components/Tile'
import { DESKTOP, COLORS, TABLET, MAX_BODY_WIDTH, LAPTOP } from '~/shared/utils/styled'
import { TheGraphProject } from '~/services/projects'
import { LoadMoreButton } from '~/components/LoadMore'
import {
    DottedLoadingIndicator,
    DottedLoadingIndicatorRoot,
} from '~/components/DottedLoadingIndicator'
import NoProductsView from './NoProductsView'

export type OwnProps = {
    projects: TheGraphProject[]
    currentUserAddress?: string
    error?: any
    isFetching?: boolean
    loadProducts?: () => void
    hasMoreSearchResults?: boolean
    noOwnProjects?: boolean
}

const MarketplaceProjectRow = styled.div<{ $fetching?: boolean }>`
    display: grid;
    grid-gap: 36px;
    grid-template-columns: 1fr;
    margin: 0;
    min-height: 100px;

    @media ${TABLET} {
        grid-template-columns: 1fr 1fr;
    }

    @media ${LAPTOP} {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    ${({ $fetching = false }) =>
        $fetching &&
        css`
            opacity: 0.5;
        `}
`

const listProjects = (
    projects: TheGraphProject[],
    currentUserAddress: string | undefined,
    isFetching: boolean | undefined,
) => {
    const isEditable = (projectId: string) => {
        if (!currentUserAddress) {
            return false
        }
        const project = projects.find((p) => p.id === projectId)
        if (project != null) {
            const perm = project.permissions.find(
                (permission) =>
                    permission.userAddress.toLowerCase() ===
                    currentUserAddress.toLowerCase(),
            )
            if (perm != null) {
                return perm.canEdit
            }
            return false
        }
        return false
    }
    return (
        <MarketplaceProjectRow $fetching={isFetching}>
            {projects.map((project) => (
                <MarketplaceProductTile
                    key={project.id}
                    product={project}
                    showDataUnionBadge={!!project.isDataUnion}
                    showEditButton={isEditable(project.id)}
                />
            ))}
        </MarketplaceProjectRow>
    )
}

export const ProjectsContainer = styled.div`
    padding: 40px 30px 3.5em 30px;
    background-color: ${COLORS.secondary};
    max-width: ${MAX_BODY_WIDTH}px;
    margin: 0 auto;

    @media ${DESKTOP} {
        padding: 72px 0 7em 0;
    }
`

export function Projects({
    projects,
    error,
    isFetching,
    loadProducts,
    hasMoreSearchResults,
    currentUserAddress,
    noOwnProjects = false,
    ...props
}: OwnProps) {
    return (
        <Root {...props}>
            {error ? <Error>{error.message}</Error> : null}
            {isFetching || projects.length > 0 ? (
                listProjects(projects, currentUserAddress, isFetching)
            ) : (
                <NoProductsView noOwnProjects={noOwnProjects} />
            )}
            {loadProducts && !isFetching && hasMoreSearchResults && (
                <LoadMoreButton onClick={loadProducts} kind="primary2">
                    Load more
                </LoadMoreButton>
            )}
            {isFetching && <DottedLoadingIndicator />}
        </Root>
    )
}

const Root = styled.div`
    ${DottedLoadingIndicatorRoot} {
        margin-top: 1.5rem;
    }
`

const Error = styled.div`
    background: rgba(255, 25, 0, 0.4);
    border-radius: 2px;
    font-size: 0.9em;
    padding: 1em 2em;
`
