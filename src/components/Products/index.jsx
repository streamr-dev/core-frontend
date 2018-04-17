// @flow

import React from 'react'
import { Row, Container } from '@streamr/streamr-layout'

import ProductTile from '../ProductTile'
import Error from '../Error'
import type { ProductList } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import styles from './products.pcss'

export type Props = {
    products: ProductList,
    error: ?ErrorInUi
}

const Products = ({ error, products }: Props) => (
    <div className={styles.products}>
        <Container>
            <Error source={error} />
            {products.length !== 0 && (
                <Row className={styles.row}>
                    {
                        products.map((product) => (
                            <ProductTile
                                key={Math.random()} // TODO: change back to product.id once product.id duplicates are not an issue on the backend
                                source={product}
                                showPublishStatus={false}
                                showSubscriptionStatus={false}
                            />
                        ))
                    }
                </Row>
            )}
        </Container>
    </div>
)

export default Products
