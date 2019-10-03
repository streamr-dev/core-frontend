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
import BackButton from './BackButton'
import Editor from './Editor'
import Preview from './Preview'
import ProductEditorDebug from './ProductEditorDebug'
import { Provider as ModalProvider } from '$shared/components/ModalContextProvider'
import ConfirmSaveModal from './ConfirmSaveModal'
import UpdateContractProductModal from './UpdateContractProductModal'
import DeployCommunityModal from './DeployCommunityModal'
import DeployContractModal from './DeployContractModal'

import styles from './editProductPage.pcss'

const EditProductPage = ({ product }: { product: Product }) => {
    const { isPreview, setIsPreview, save, deployCommunity } = useContext(EditControllerContext)
    const { isPending: savePending } = usePending('product.SAVE')

    const isSaving = savePending
    const isCommunityProduct = product.type === 'COMMUNITY'

    const actions = useMemo(() => {
        let buttons = {
            saveAndExit: {
                title: 'Save & Exit',
                color: 'link',
                outline: true,
                onClick: save,
                disabled: isSaving,
            },
        }

        if (isPreview) {
            buttons = {
                ...buttons,
                preview: {
                    title: 'Edit',
                    outline: true,
                    onClick: () => setIsPreview(false),
                    disabled: isSaving,
                },
            }
        } else {
            buttons = {
                ...buttons,
                preview: {
                    title: 'Preview',
                    outline: true,
                    onClick: () => setIsPreview(true),
                    disabled: isSaving,
                },
            }
        }

        if (isCommunityProduct) {
            buttons = {
                ...buttons,
                continue: {
                    title: 'Continue',
                    color: 'primary',
                    onClick: deployCommunity,
                    disabled: isSaving,
                },
            }
        } else {
            buttons = {
                ...buttons,
                publish: {
                    title: 'Publish',
                    color: 'primary',
                    onClick: () => {},
                    disabled: true,
                },
            }
        }

        return buttons
    }, [isPreview, setIsPreview, save, deployCommunity, isSaving, isCommunityProduct])

    return (
        <CoreLayout
            className={styles.layout}
            hideNavOnDesktop
            navComponent={(
                <Toolbar
                    left={<BackButton />}
                    actions={actions}
                    altMobileLayout
                />
            )}
            loadingClassname={styles.loadingIndicator}
            loading={isSaving}
        >
            <ProductEditorDebug />
            {isPreview && (
                <Preview />
            )}
            {!isPreview && (
                <Editor />
            )}
            <ConfirmSaveModal />
            <UpdateContractProductModal />
            <DeployCommunityModal />
            <DeployContractModal />
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
