// @flow

import React, { useContext, useMemo, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import CoreLayout from '$shared/components/Layout/Core'
import * as UndoContext from '$shared/contexts/Undo'
import Toolbar from '$shared/components/Toolbar'
import type { Product } from '$mp/flowtype/product-types'
import { isCommunityProduct } from '$mp/utils/product'

import ProductController, { useController } from '../ProductController'
import useEditableProduct from '../ProductController/useEditableProduct'
import usePending from '$shared/hooks/usePending'
import { productStates } from '$shared/utils/constants'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import { isEthereumAddress } from '$mp/utils/validate'
import { notFoundRedirect } from '$auth/utils/loginInterceptor'
import useProductPermissions from '../ProductController/useProductPermissions'

import { Provider as EditControllerProvider, Context as EditControllerContext } from './EditControllerProvider'
import BackButton from '$shared/components/BackButton'
import Editor from './Editor'
import Preview from './Preview'
import ProductEditorDebug from './ProductEditorDebug'
import ConfirmSaveModal from './ConfirmSaveModal'
import DeployCommunityModal from './DeployCommunityModal'
import PublishModal from './PublishModal'
import CropImageModal from './CropImageModal'

import styles from './editProductPage.pcss'

const EditProductPage = ({ product }: { product: Product }) => {
    const {
        isPreview,
        setIsPreview,
        save,
        publish,
        deployCommunity,
        back,
    } = useContext(EditControllerContext)
    const { isPending: savePending } = usePending('product.SAVE')
    const { isAnyChangePending } = useContext(ValidationContext)
    const { loadCategories, loadStreams } = useController()

    // Load categories and streams
    useEffect(() => {
        loadCategories()
        loadStreams()
    }, [loadCategories, loadStreams])

    const isSaving = savePending
    const isCommunity = isCommunityProduct(product)
    // TODO: should really check for the contract existance here
    const isDeployed = isCommunity && isEthereumAddress(product.beneficiaryAddress)

    const saveAndExitButton = useMemo(() => ({
        title: 'Save & Exit',
        kind: 'link',
        onClick: () => save(),
        disabled: isSaving,
    }), [save, isSaving])

    const previewButton = useMemo(() => {
        if (isPreview) {
            return {
                title: 'Edit',
                outline: true,
                onClick: () => setIsPreview(false),
                disabled: isSaving,
            }
        }

        return {
            title: 'Preview',
            outline: true,
            onClick: () => setIsPreview(true),
            disabled: isSaving,
        }
    }, [isPreview, setIsPreview, isSaving])

    const productState = product.state
    const publishButton = useMemo(() => {
        const titles = {
            [productStates.DEPLOYING]: 'publishing',
            [productStates.UNDEPLOYING]: 'unpublishing',
            [productStates.NOT_DEPLOYED]: 'publish',
            [productStates.DEPLOYED]: 'unpublish',
            republish: 'republish',
        }

        const tmpState: any = (productState === productStates.DEPLOYED && isAnyChangePending()) ? 'republish' : productState

        return {
            title: (productState && I18n.t(`editProductPage.${titles[tmpState]}`)) || '',
            kind: 'primary',
            onClick: publish,
            disabled: !(productState === productStates.NOT_DEPLOYED || productState === productStates.DEPLOYED) || isSaving,
        }
    }, [isAnyChangePending, productState, publish, isSaving])

    const deployButton = useMemo(() => {
        if (isCommunity && !isDeployed) {
            return {
                title: 'Continue',
                kind: 'primary',
                onClick: deployCommunity,
                disabled: isSaving,
            }
        }

        return publishButton
    }, [isCommunity, isDeployed, deployCommunity, isSaving, publishButton])

    const actions = {
        saveAndExit: saveAndExitButton,
        preview: previewButton,
        publish: deployButton,
    }

    const toolbarMiddle = useMemo(() => {
        if (isPreview) {
            return (
                <span className={styles.toolbarMiddle}>
                    This is a preview of how your product will appear when published
                </span>
            )
        }

        return undefined
    }, [isPreview])

    return (
        <CoreLayout
            className={styles.layout}
            hideNavOnDesktop
            navComponent={(
                <Toolbar
                    className={Toolbar.styles.shadow}
                    left={<BackButton onBack={back} />}
                    middle={toolbarMiddle}
                    actions={actions}
                    altMobileLayout
                />
            )}
            loadingClassname={styles.loadingIndicator}
            contentClassname={cx({
                [styles.editorContent]: !isPreview,
                [styles.previewContent]: !!isPreview,
            })}
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
            <DeployCommunityModal />
            <PublishModal />
            <CropImageModal />
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
                className={Toolbar.styles.shadow}
                actions={{}}
                altMobileLayout
            />
        )}
    />
)

const EditWrap = () => {
    const product = useEditableProduct()
    const { isPending: isLoadPending } = usePending('product.LOAD')
    const { isPending: isPermissionsPending } = usePending('product.PERMISSIONS')
    const { hasPermissions, write, share } = useProductPermissions()
    const canEdit = !!(write || share)

    if (hasPermissions && !isPermissionsPending && !canEdit) {
        notFoundRedirect()
    }

    if (!product || isLoadPending || isPermissionsPending || !hasPermissions || !canEdit) {
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
