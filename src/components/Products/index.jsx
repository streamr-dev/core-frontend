// @flow

import React from 'react'
import { Row, Container, Col } from '@streamr/streamr-layout'
import ProductTile from '../ProductTile'
import LoadMore from '../LoadMore'
import Error from '../Error'
import type { ProductList } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import styles from './products.pcss'

export type Props = {
    products: ProductList,
    error: ?ErrorInUi,
    isFetching: boolean,
    loadMoreProducts: () => void,
    hasMoreSearchResults: boolean,
}

const Products = ({
    error,
    products,
    isFetching,
    loadMoreProducts,
    hasMoreSearchResults,
}: Props) => (
    <div className={styles.products}>
        <Container>
            <Error source={error} />
            {products.length !== 0 && (
                <Row className={styles.row}>
                    {products.map((product, index) => (
                        <Col
                            xs={3}
                            key={
                                /* eslint-disable react/no-array-index-key */
                                `${index}-${product.id || ''}`
                                /* eslint-enable react/no-array-index-key */
                            }
                        >
                            <ProductTile
                                source={product}
                                showPublishStatus={false}
                                showSubscriptionStatus={false}
                            />
                        </Col>
                    ))}
                </Row>
            )}
            <LoadMore
                isFetching={isFetching}
                loadMore={loadMoreProducts}
                hasMoreSearchResults={hasMoreSearchResults}
            />
        </Container>
    </div>
)

export default Products
