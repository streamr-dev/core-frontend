// @flow

import React from 'react'
import classnames from 'classnames'
import { Row, Container, Col } from '@streamr/streamr-layout'

import type { ProductList, Product } from '../../flowtype/product-types'
import type { Props } from '../ProductTile'
import ProductTile from '../ProductTile'
import ProductPageSpinner from '../ProductPageSpinner'
import LoadMore from '../LoadMore'
import Error from '../Error'

import { getTileProps, getErrorView, getCols } from './settings'
import styles from './products.pcss'

export type ProductTilePropType = "myProducts" | "myPurchases" | "products"
export type ProductTileProps = $Rest<Props, {|source: Product|}>

export type OwnProps = {
    products: ProductList,
    type: ProductTilePropType,
    error?: any,
    isFetching?: boolean,
    loadProducts?: () => void,
    hasMoreSearchResults?: boolean,
}

const listProducts = (products, cols, productTileProps: ProductTileProps, isFetching: ?boolean) => (
    <Row
        className={classnames(styles.productsRow, {
            [styles.fetching]: isFetching,
        })}
    >
        {products.map((product) => (
            <Col {...cols} key={product.key || product.id} >
                <ProductTile
                    {...productTileProps}
                    source={product}
                />
            </Col>
        ))}
    </Row>
)

const Products = ({
    products,
    type,
    error,
    isFetching,
    loadProducts,
    hasMoreSearchResults,
}: OwnProps) => (
    <Container className={styles.products}>
        <Error source={error} />
        {(isFetching || products.length > 0) ? listProducts(products, getCols(type), getTileProps(type), isFetching) : getErrorView(type)}
        {(loadProducts && !isFetching) && (
            <LoadMore
                onClick={loadProducts}
                hasMoreSearchResults={!!hasMoreSearchResults}
            />
        )}
        {isFetching && (
            <ProductPageSpinner className={styles.spinner} />
        )}
    </Container>
)

export default Products
