// @flow

import React from 'react'
import { Container } from 'reactstrap'
import { withRouter } from 'react-router-dom'

import Layout from '$mp/components/Layout'
import type { Product } from '$mp/flowtype/product-types'
import * as UndoContext from '$shared/components/UndoContextProvider'

import ProductController from '../ProductController'
import useProductUpdater from '../ProductController/useProductUpdater'
import useProduct from '../ProductController/useProduct'

import styles from './editProductPage.pcss'

type Props = {
    product: Product,
}

const EditProductPage = ({ product }: Props) => (
    <div className={styles.root}>
        <Container className={styles.container}>
            <h1>{product.name}</h1>
        </Container>
    </div>
)

const EditWrap = () => {
    const { replaceProduct, updateProduct } = useProductUpdater()
    const product = useProduct()

    if (!product) {
        return null
    }

    const key = (!!product && product.id) || ''

    return (
        <EditProductPage
            key={key}
            replace={replaceProduct}
            push={updateProduct}
            product={product}
        />
    )
}

const ProductContainer = withRouter((props) => (
    <UndoContext.Provider key={props.match.params.id}>
        <ProductController>
            <EditWrap />
        </ProductController>
    </UndoContext.Provider>
))

export default () => (
    <Layout>
        <ProductContainer />
    </Layout>
)
