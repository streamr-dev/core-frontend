// @flow

import React from 'react'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'

import CoreLayout from '$shared/components/Layout/Core'
import * as UndoContext from '$shared/components/UndoContextProvider'
import DetailsContainer from '$shared/components/Container/Details'
import Toolbar from '$shared/components/Toolbar'

import ProductController from '../ProductController'
import useProduct from '../ProductController/useProduct'

import EditorNav from './EditorNav'
import ProductName from './ProductName'
import CoverImage from './CoverImage'
import ProductDescription from './ProductDescription'
import StreamSelector from './StreamSelector'
import PriceSelector from './PriceSelector'
import ProductDetails from './ProductDetails'
import ProductTypeSelectorForTesting from './ProductTypeSelectorForTesting'

import styles from './editProductPage.pcss'

const EditProductPage = () => (
    <div className={cx(styles.root, styles.EditProductPage)}>
        <DetailsContainer className={styles.container}>
            <div className={styles.editor}>
                <div className={styles.nav}>
                    <EditorNav />
                </div>
                <div className={styles.info}>
                    <ProductTypeSelectorForTesting />
                    <ProductName />
                    <CoverImage />
                    <ProductDescription />
                    <StreamSelector />
                    <PriceSelector />
                    <ProductDetails />
                </div>
            </div>
        </DetailsContainer>
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
    <CoreLayout
        className={styles.layout}
        hideNavOnDesktop
        navComponent={(
            <Toolbar
                actions={{
                    saveAndExit: {
                        title: 'Save & Exit',
                        color: 'link',
                        outline: true,
                        onClick: () => {},
                    },
                    preview: {
                        title: 'Preview',
                        outline: true,
                        onClick: () => {},
                    },
                    continue: {
                        title: 'Continue',
                        color: 'primary',
                        onClick: () => {},
                        disabled: true,
                    },
                }}
                altMobileLayout
            />
        )}
    >
        <ProductContainer />
    </CoreLayout>
)
