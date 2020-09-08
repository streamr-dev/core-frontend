// @flow

import React from 'react'
import classnames from 'classnames'
import styled from 'styled-components'
import { Row, Container as RsContainer, Col } from 'reactstrap'
import { isDataUnionProduct } from '$mp/utils/product'
import type { ProductList } from '../../flowtype/product-types'
import { MarketplaceProductTile as UnstyledMarketplaceProductTile } from '$shared/components/Tile'
import ProductPageSpinner from '../ProductPageSpinner'
import LoadMore from '../LoadMore'
import Error from '../Error'

import { MD, LG, REGULAR } from '$shared/utils/styled'
import { getErrorView, getCols } from './settings'
import styles from './products.pcss'

export type Props = {}

export type ProductTilePropType = "products" | "relatedProducts"

export type OwnProps = {
    products: ProductList,
    type: ProductTilePropType,
    error?: any,
    isFetching?: boolean,
    loadProducts?: () => void,
    hasMoreSearchResults?: boolean,
    header?: string,
}

const MarketplaceProductTile = styled(UnstyledMarketplaceProductTile)`
    margin-top: 16px;
`

const listProducts = (products, cols, isFetching: ?boolean) => (
    <Row
        className={classnames(styles.productsRow, {
            [styles.fetching]: isFetching,
        })}
    >
        {products.map((product) => (
            <Col {...cols} key={product.key || product.id} >
                <MarketplaceProductTile
                    product={product}
                    showDataUnionBadge={isDataUnionProduct(product.type)}
                />
            </Col>
        ))}
    </Row>
)

const Container = styled(RsContainer)`
    padding: 1.25em 30px 3.5em 30px;

    @media (min-width: ${LG}px) {
        padding: 1.5em 5em 7em 5em;
    }
`

const Header = styled.h3`
    font-size: 18px;
    font-weight: ${REGULAR};

    @media (min-width: ${MD}px) {
        font-size: 24px;
    }
`

const UnstyledProducts = ({
    products,
    type,
    error,
    isFetching,
    loadProducts,
    hasMoreSearchResults,
    header,
    ...props
}: OwnProps) => (
    <div {...props}>
        {(header && (
            <Header>
                {header}
            </Header>
        ))}
        <Error source={error} />
        {(isFetching || products.length > 0)
            ? listProducts(products, getCols(type), isFetching)
            : getErrorView(type)}
        {(loadProducts && !isFetching) && (
            <LoadMore
                onClick={loadProducts}
                hasMoreSearchResults={!!hasMoreSearchResults}
            />
        )}
        {isFetching && (
            <ProductPageSpinner className={styles.spinner} />
        )}
    </div>
)

const Products = styled(UnstyledProducts)``

Object.assign(Products, {
    Header,
    Container,
})

export default Products
