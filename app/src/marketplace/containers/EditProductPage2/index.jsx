// @flow

import React, { useContext } from 'react'
import { Container } from 'reactstrap'
import { withRouter } from 'react-router-dom'

import Layout from '$mp/components/Layout'
import * as UndoContext from '$shared/components/UndoContextProvider'

import * as RouterContext from '$shared/components/RouterContextProvider'
import ProductController from '../ProductController'
import useProductUpdater from '../ProductController/useProductUpdater'
import useProduct from '../ProductController/useProduct'

import styles from './editProductPage.pcss'

const EditProductPage = () => {
    const { match } = useContext(RouterContext.Context)
    console.log(match)

    return (
        <div className={styles.root}>
            <Container className={styles.container}>
                New product editor...
            </Container>
        </div>
    )
}

const EditWrap = () => {
    const { replaceProduct, updateProduct } = useProductUpdater()
    const product = useProduct()

    if (!product) {
        return (
            <div>
                no product!
            </div>
        )
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
