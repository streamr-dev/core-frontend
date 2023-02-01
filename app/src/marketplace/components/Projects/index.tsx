import React from 'react'
import classnames from 'classnames'
import styled from 'styled-components'
import { Row, Container as RsContainer, Col } from 'reactstrap'
import { isDataUnionProduct } from '$mp/utils/product'
import { MarketplaceProductTile as UnstyledMarketplaceProductTile } from '$shared/components/Tile'
import { REGULAR, DESKTOP, COLORS, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import { TheGraphProject } from '$app/src/services/projects'
import ProductPageSpinner from '../ProductPageSpinner'
import Error from '../Error'
import { getErrorView, getCols } from './settings'
import styles from './projects.pcss'

export type ProjectTilePropType = 'projects' | 'relatedProjects'

export type OwnProps = {
    projects: TheGraphProject[]
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
    padding: 40px 30px 3.5em 30px;
    background-color: ${COLORS.secondary};

    @media (${DESKTOP}) {
        padding: 72px 5em 7em 5em;
    }
`
export const ProjectsHeader = styled.h3`
    font-size: 34px;
    line-height: 34px;
    font-weight: ${REGULAR};
    margin-bottom: 16px;
    @media(${TABLET}) {
      margin-bottom: 40px;
    }
`

export const LoadMoreButton = styled(Button)`
  display: block !important;
  margin: 130px auto 80px;
`

const UnstyledProjects = ({ projects, type, error, isFetching, loadProducts, hasMoreSearchResults, header, ...props }: OwnProps) => (
    <div {...props}>
        {header && <ProjectsHeader>{header}</ProjectsHeader>}
        <Error source={error} />
        {isFetching || projects.length > 0 ? listProjects(projects, getCols(type), isFetching) : getErrorView(type)}
        {loadProducts && !isFetching && hasMoreSearchResults && <LoadMoreButton onClick={loadProducts} kind={'primary2'}>Load more</LoadMoreButton>}
        {isFetching && <ProductPageSpinner className={styles.spinner} />}
    </div>
)

const ProjectsComponent = styled(UnstyledProjects)<OwnProps>``

export default ProjectsComponent
