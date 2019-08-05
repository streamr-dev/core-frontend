// @flow

import React from 'react'
import { Container } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'

import Layout from '$shared/components/Layout'
import * as UndoContext from '$shared/components/UndoContextProvider'

import ProductController from '../ProductController'
import useProduct from '../ProductController/useProduct'

import EditorNav from './EditorNav'
import ProductName from './ProductName'
import CoverImage from './CoverImage'
import ProductDescription from './ProductDescription'
import StreamSelector from './StreamSelector'
import PriceSelector from './PriceSelector'

import styles from './editProductPage.pcss'

const EditProductPage = () => (
    <div className={cx(styles.root, styles.EditProductPage)}>
        <Container className={styles.container}>
            <div className={styles.editor}>
                <div className={styles.nav}>
                    <EditorNav />
                </div>
                <div className={styles.info}>
                    <ProductName />
                    <CoverImage />
                    <ProductDescription />
                    <StreamSelector />
                    <PriceSelector />
                </div>
            </div>
        </Container>
    </div>
)

const EditWrap = () => {
    const product = useProduct()

    if (!product) {
        return null
    }

    const key = (!!product && product.id) || ''

    return (
        <EditProductPage
            key={key}
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
    <Layout className={styles.layout}>
        <ProductContainer />
    </Layout>
)
