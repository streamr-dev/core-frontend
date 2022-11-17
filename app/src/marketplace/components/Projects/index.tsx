import React from 'react'
import classnames from 'classnames'
import styled from 'styled-components'
import { Row, Container as RsContainer, Col } from 'reactstrap'
import { isDataUnionProduct } from '$mp/utils/product'
import { MarketplaceProductTile as UnstyledMarketplaceProductTile } from '$shared/components/Tile'
import { MD, REGULAR, DESKTOP, COLORS } from '$shared/utils/styled'
import type { ProjectList } from '../../types/project-types'
import ProductPageSpinner from '../ProductPageSpinner'
import LoadMore from '../LoadMore'
import Error from '../Error'
import { getErrorView, getCols } from './settings'
import styles from './projects.pcss'

export type ProjectTilePropType = 'projects' | 'relatedProjects'

export type OwnProps = {
    projects: ProjectList
    type: ProjectTilePropType
    error?: any
    isFetching?: boolean
    loadProducts?: () => void
    hasMoreSearchResults?: boolean
    header?: string
}

export const MarketplaceProductTile = styled(UnstyledMarketplaceProductTile)`
    margin-top: 16px;
`
export const MarketplaceProjectRow = styled(Row)``
export const MarketplaceProjectCol = styled(Col)`
    padding-left: 1em;
    padding-right: 1em;
`

const listProjects = (products, cols, isFetching: boolean | null | undefined) => (
    <MarketplaceProjectRow
        className={classnames(styles.productsRow, {
            [styles.fetching]: isFetching,
        })}
    >
        {products.map((product) => (
            <MarketplaceProjectCol {...cols} key={product.key || product.id}>
                <MarketplaceProductTile product={product} showDataUnionBadge={isDataUnionProduct(product.type)} />
            </MarketplaceProjectCol>
        ))}
    </MarketplaceProjectRow>
)

export const ProjectsContainer = styled(RsContainer)`
    padding: 1.25em 30px 3.5em 30px;
    background-color: ${COLORS.secondary};

    @media (${DESKTOP}) {
        padding: 1.5em 5em 7em 5em;
    }
`
export const ProjectsHeader = styled.h3`
    font-size: 18px;
    font-weight: ${REGULAR};

    @media (min-width: ${MD}px) {
        font-size: 24px;
    }
`

const UnstyledProjects = ({ projects, type, error, isFetching, loadProducts, hasMoreSearchResults, header, ...props }: OwnProps) => (
    <div {...props}>
        {header && <ProjectsHeader>{header}</ProjectsHeader>}
        <Error source={error} />
        {isFetching || projects.length > 0 ? listProjects(projects, getCols(type), isFetching) : getErrorView(type)}
        {loadProducts && !isFetching && <LoadMore onClick={loadProducts} hasMoreSearchResults={!!hasMoreSearchResults} />}
        {isFetching && <ProductPageSpinner className={styles.spinner} />}
    </div>
)

const ProjectsComponent = styled(UnstyledProjects)<OwnProps>``

export default ProjectsComponent
