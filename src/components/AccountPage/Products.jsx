// @flow

import React, { type Node } from 'react'

import { Row, Container, Col } from '@streamr/streamr-layout'
import type { ProductList, Product } from '../../flowtype/product-types'

import ProductTile, { type Props } from '../ProductTile'

type ProductTileProps = $Rest<Props, {|source: Product|}>

export type OwnProps = {
    products: ProductList,
    productTileProps: ProductTileProps,
    children?: Node
}

const listProducts = (products, productTileProps: ProductTileProps) => (
    <Row >
        {products.length > 0 && products.map((product) => (
            <Col xs={12} md={6} lg={3} key={product.id} >
                <ProductTile
                    {...productTileProps}
                    source={product}
                />
            </Col>
        ))}
    </Row>
)

const Products = ({ products, productTileProps, children }: OwnProps) => (
    <Container>
        {(products.length > 0 && listProducts(products, productTileProps)) || children}
    </Container>
)

export default Products
