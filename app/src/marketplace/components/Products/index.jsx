// @flow

import React from 'react'
import classnames from 'classnames'
import { Row, Container, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'

import links from '$mp/../links'
import { timeUnits } from '$shared/utils/constants'
import PaymentRate from '../PaymentRate'
import { formatPath } from '$shared/utils/url'
import { isPaidProduct, isDataUnionProduct } from '$mp/utils/product'
import type { ProductList } from '../../flowtype/product-types'
import Tile from '$shared/components/Tile2'
import ProductPageSpinner from '../ProductPageSpinner'
import LoadMore from '../LoadMore'
import Error from '../Error'
import ImageContainer from '$shared/components/Tile2/ImageContainer'
import Summary from '$shared/components/Tile2/Summary'
import { DataUnionBadge, IconBadge } from '$shared/components/Tile2/Badge'

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

const listProducts = (products, cols, isFetching: ?boolean) => (
    <Row
        className={classnames(styles.productsRow, {
            [styles.fetching]: isFetching,
        })}
    >
        {products.map((product) => {
            const isDataUnion = isDataUnionProduct(product.type)

            const price = isPaidProduct(product) ? (
                <PaymentRate
                    amount={product.pricePerSecond}
                    currency={product.priceCurrency}
                    timeUnit={timeUnits.hour}
                    maxDigits={4}
                />
            ) : (
                <Translate value="productTile.free" />
            )

            return (
                <Col {...cols} key={product.key || product.id} >
                    <Tile>
                        <Link to={formatPath(links.marketplace.products, product.id || '')}>
                            <ImageContainer src={product.imageUrl}>
                                {isDataUnion && (
                                    <DataUnionBadge top left />
                                )}
                                {/* $FlowFixMe `members` is missing in `Product`. */}
                                {isDataUnion && typeof product.members !== 'undefined' && (
                                    <IconBadge icon="dataUnion" bottom right>
                                        {product.members}
                                    </IconBadge>
                                )}
                            </ImageContainer>
                            <Summary
                                name={product.name}
                                updatedAt={product.owner}
                                label={price}
                            />
                        </Link>
                    </Tile>
                </Col>
            )
        })}
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
}: OwnProps) => (
    <Container className={styles[type]} fluid={type === 'products'}>
        {(header && <h3>{header}</h3>)}
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
    </Container>
)

export default Products
