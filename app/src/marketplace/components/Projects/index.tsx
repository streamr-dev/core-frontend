import React from 'react'
import styled from 'styled-components'
import classnames from 'classnames'
import { isDataUnionProject } from '$mp/utils/product'
import { MarketplaceProductTile as UnstyledMarketplaceProductTile } from '$shared/components/Tile'
import {
    REGULAR,
    DESKTOP,
    COLORS,
    TABLET,
    MAX_BODY_WIDTH,
    LAPTOP,
} from '$shared/utils/styled'
import Button from '$shared/components/Button'
import { TheGraphProject } from '$app/src/services/projects'
import ProductPageSpinner from '../ProductPageSpinner'
import Error from '../Error'
import styles from './projects.pcss'
import NoProductsView from './NoProductsView'

export type ProjectTilePropType = 'projects' | 'relatedProjects'

export type OwnProps = {
    projects: TheGraphProject[]
    currentUserAddress?: string
    type: ProjectTilePropType
    error?: any
    isFetching?: boolean
    loadProducts?: () => void
    hasMoreSearchResults?: boolean
    header?: string
    noOwnProjects?: boolean
}

export const MarketplaceProductTile = styled(UnstyledMarketplaceProductTile)`
    margin-top: 16px;
`
export const MarketplaceProjectRow = styled.div`
    display: grid;
    grid-gap: 36px;
    margin: 0;
    grid-template-columns: 1fr;

    @media ${TABLET} {
        grid-template-columns: 1fr 1fr;
    }

    @media ${LAPTOP} {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`
export const MarketplaceProjectCol = styled.div`
    padding: 0;
`

const listProjects = (
    projects: TheGraphProject[],
    currentUserAddress: string,
    isFetching: boolean | null | undefined,
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
        <MarketplaceProjectRow
            className={classnames(styles.productsRow, {
                [styles.fetching]: isFetching,
            })}
        >
            {projects.map((project) => (
                <MarketplaceProjectCol key={project.id}>
                    <MarketplaceProductTile
                        product={project}
                        showDataUnionBadge={isDataUnionProject(project)}
                        showEditButton={isEditable(project.id)}
                    />
                </MarketplaceProjectCol>
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
export const ProjectsHeader = styled.h3`
    font-size: 34px;
    line-height: 34px;
    font-weight: ${REGULAR};
    margin-bottom: 16px;

    @media ${TABLET} {
        margin-bottom: 40px;
    }
`

export const LoadMoreButton = styled(Button)`
    display: block !important;
    margin: 130px auto 80px;
`

const UnstyledProjects = ({
    projects,
    type,
    error,
    isFetching,
    loadProducts,
    hasMoreSearchResults,
    header,
    currentUserAddress,
    noOwnProjects = false,
    ...props
}: OwnProps) => (
    <div {...props}>
        {header && <ProjectsHeader>{header}</ProjectsHeader>}
        <Error source={error} />
        {isFetching || projects.length > 0 ? (
            listProjects(projects, currentUserAddress, isFetching)
        ) : (
            <NoProductsView noOwnProjects={noOwnProjects} />
        )}
        {loadProducts && !isFetching && hasMoreSearchResults && (
            <LoadMoreButton onClick={loadProducts} kind={'primary2'}>
                Load more
            </LoadMoreButton>
        )}
        {isFetching && <ProductPageSpinner className={styles.spinner} />}
    </div>
)

const ProjectsComponent = styled(UnstyledProjects)<OwnProps>``

export default ProjectsComponent
