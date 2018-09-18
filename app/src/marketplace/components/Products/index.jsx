// @flow

import React from 'react'
import merge from 'lodash/merge'
import classnames from 'classnames'
import { Row, Container, Col } from 'reactstrap'

import type { ProductList, Product, ProductSubscription } from '../../flowtype/product-types'
import type { Props } from '../ProductTile'
import ProductTile from '../ProductTile'
import ProductPageSpinner from '../ProductPageSpinner'
import LoadMore from '../LoadMore'
import Error from '../Error'
import { isActive } from '../../utils/time'

import { getTileProps, getErrorView, getCols } from './settings'
import styles from './products.pcss'

export type ProductTilePropType = "myProducts" | "myPurchases" | "products" | "relatedProducts"
export type ProductTileProps = $Rest<Props, {|source: Product|}>

export type OwnProps = {
    products: ProductList,
    type: ProductTilePropType,
    error?: any,
    isFetching?: boolean,
    loadProducts?: () => void,
    hasMoreSearchResults?: boolean,
    header?: string,
    productTileProps?: ProductTileProps,
    subscriptions?: Array<ProductSubscription>,
}

const isSubscriptionActive = (subscription?: ProductSubscription): boolean => isActive((subscription && subscription.endsAt) || '')

const listProducts = (products, cols, productTileProps: ProductTileProps, isFetching: ?boolean, subscriptions?: Array<ProductSubscription>) => (
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
                    isActive={subscriptions && isSubscriptionActive(subscriptions.find((s) => s.product.id === product.id))}
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
    header,
    productTileProps,
    subscriptions,
}: OwnProps) => (
    <Container className={styles[type]} fluid={type === 'products'}>
        {(header && <h3>{header}</h3>)}
        <Error source={error} />
        {(isFetching || products.length > 0)
            ? listProducts(products, getCols(type), merge({}, getTileProps(type), productTileProps), isFetching, subscriptions)
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
    </Container>
)

export default Products
