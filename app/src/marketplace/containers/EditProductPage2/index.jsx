// @flow

import React from 'react'
import { Container } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'

import Layout from '$mp/components/Layout'
import * as UndoContext from '$shared/components/UndoContextProvider'

import ProductController from '../ProductController'
import useProductUpdater from '../ProductController/useProductUpdater'
import useProduct from '../ProductController/useProduct'

import EditorNav from './EditorNav'
import ProductName from './ProductName'

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
                    <h1>Add a cover image</h1>
                    <p>This image will be shown as the tile image in the Marketplace browse view,
                        and also as the main image on your product page. For best quality,
                        an image size of around 1000 x 800px is recommended. PNG or JPEG format.
                        Need images? See the docs.
                    </p>
                    <h1>Write a product description</h1>
                    <p>Sell your product — make sure you include details about the contents of
                        your streams, historical data, and any other relevant details.
                        Generally around a maximum of around 300 words fits best on a product
                        detail page. Markdown formatting is ok.
                    </p>
                    <h1>Add streams</h1>
                    <p>Products can contain a range of streams, or a single &quot;firehose&quot; type stream, it&apos;s up to you.
                        If you haven&apos;t made any streams yet, you can create one here. For help creating streams, see the docs.
                    </p>
                    <h1>Set a price</h1>
                    <h1>Give us some more details</h1>
                </div>
            </div>
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
    <Layout className={styles.layout}>
        <ProductContainer />
    </Layout>
)
