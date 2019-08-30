// @flow

import React, { useContext, useMemo } from 'react'
import { withRouter } from 'react-router-dom'

import CoreLayout from '$shared/components/Layout/Core'
import * as UndoContext from '$shared/components/UndoContextProvider'
import Toolbar from '$shared/components/Toolbar'
import type { Product } from '$mp/flowtype/product-types'

import ProductController from '../ProductController'
import useProduct from '../ProductController/useProduct'
import usePending from '$shared/hooks/usePending'

import { Provider as EditControllerProvider, Context as EditControllerContext } from './EditControllerProvider'
import Editor from './Editor'
import Preview from './Preview'
import ProductEditorDebug from './ProductEditorDebug'
import { Provider as ModalProvider } from '$shared/components/ModalContextProvider'
import ConfirmNoCoverImageModal from './ConfirmNoCoverImageModal'
import UpdateContractProductModal from './UpdateContractProductModal'

import styles from './editProductPage.pcss'

const EditProductPage = ({ product }: { product: Product }) => {
    const { isPreview, setIsPreview, save } = useContext(EditControllerContext)
    const { isPending: savePending } = usePending('product.SAVE')
    const { isPending: contractSavePending } = usePending('contractProduct.SAVE')

    const isSaving = savePending || contractSavePending

    console.log(product)

    const actions = useMemo(() => {
        const buttons = {
            saveAndExit: {
                title: 'Save & Exit',
                color: 'link',
                outline: true,
                onClick: save,
                disabled: isSaving,
            },
            preview: {
                title: 'Preview',
                outline: true,
                onClick: () => setIsPreview(true),
                disabled: isSaving,
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
                disabled: isSaving,
            }
        }

        return buttons
    }, [isPreview, setIsPreview, save, isSaving])

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
            loadingClassname={styles.loadingIndicator}
            loading={savePending}
        >
            <ProductEditorDebug />
            {isPreview && (
                <Preview />
            )}
            {!isPreview && (
                <Editor />
            )}
            <ConfirmNoCoverImageModal />
            <UpdateContractProductModal />
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
        <ModalProvider>
            <EditControllerProvider product={product}>
                <EditProductPage
                    key={key}
                    product={product}
                />
            </EditControllerProvider>
        </ModalProvider>
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
