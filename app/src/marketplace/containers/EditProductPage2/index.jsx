// @flow

import React, { useContext, useMemo } from 'react'
import { withRouter } from 'react-router-dom'

import CoreLayout from '$shared/components/Layout/Core'
import * as UndoContext from '$shared/components/UndoContextProvider'
import Toolbar from '$shared/components/Toolbar'

import ProductController from '../ProductController'
import useProduct from '../ProductController/useProduct'

import { Provider as EditControllerProvider, Context as EditControllerContext } from './EditControllerProvider'
import Editor from './Editor'
import ProductEditorDebug from './ProductEditorDebug'

import styles from './editProductPage.pcss'

const EditProductPage = () => {
    const { isPreview, setIsPreview } = useContext(EditControllerContext)

    const actions = useMemo(() => {
        const buttons = {
            saveAndExit: {
                title: 'Save & Exit',
                color: 'link',
                outline: true,
                onClick: () => {},
            },
            preview: {
                title: 'Preview',
                outline: true,
                onClick: () => setIsPreview(true),
            },
            continue: {
                title: 'Continue',
                color: 'primary',
                onClick: () => {},
                disabled: true,
            },
        }

        if (isPreview) {
            buttons.preview = {
                title: 'Edit',
                outline: true,
                onClick: () => setIsPreview(false),
            }
        }

        return buttons
    }, [isPreview, setIsPreview])

    return (
        <CoreLayout
            className={styles.layout}
            hideNavOnDesktop
            navComponent={(
                <Toolbar
                    actions={actions}
                    altMobileLayout
                />
            )}
        >
            <ProductEditorDebug />
            {isPreview && (
                <p>sd</p>
            )}
            {!isPreview && (
                <Editor />
            )}
        </CoreLayout>
    )
}

const LoadingView = () => (
    <CoreLayout
        className={styles.layout}
        hideNavOnDesktop
        loading
        navComponent={(
            <Toolbar
                actions={{}}
                altMobileLayout
            />
        )}
    />
)

const EditWrap = () => {
    const product = useProduct()

    if (!product) {
        return <LoadingView />
    }

    const key = (!!product && product.id) || ''

    return (
        <EditControllerProvider product={product}>
            <EditProductPage
                key={key}
                product={product}
            />
        </EditControllerProvider>
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
    <ProductContainer />
)
