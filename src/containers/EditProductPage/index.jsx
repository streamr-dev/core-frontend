// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageEditorComponent from '../../components/ProductPageEditor'
import type { Props as ProductPageEditorProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId, EditProduct } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'
import type { PriceDialogProps } from '../../components/Modal/SetPriceDialog'
import type { StreamList } from '../../flowtype/stream-types'
import type { CategoryList, Category } from '../../flowtype/category-types'

import { getProductById } from '../../modules/product/actions'
import { resetEditProduct, initEditProduct, updateEditProductField } from '../../modules/editProduct/actions'
import { getStreams } from '../../modules/streams/actions'
import { setImageToUpload } from '../../modules/createProduct/actions'
import { selectImageToUpload } from '../../modules/createProduct/selectors'
import { showModal } from '../../modules/modals/actions'
import { getCategories } from '../../modules/categories/actions'
import { getUserProductPermissions } from '../../modules/user/actions'
import {
    selectFetchingProduct,
    selectCategory,
    selectProduct,
    selectProductError,
    selectStreams,
    selectFetchingStreams,
    selectStreamsError,
} from '../../modules/product/selectors'
import { selectAccountId } from '../../modules/web3/selectors'
import { selectAllCategories } from '../../modules/categories/selectors'
import {
    selectProductEditPermission,
    selectProductPublishPermission,
} from '../../modules/user/selectors'
import { SET_PRICE, CONFIRM_NO_COVER_IMAGE, SAVE_PRODUCT } from '../../utils/modals'
import { selectStreams as selectAvailableStreams } from '../../modules/streams/selectors'
import { selectEditProduct } from '../../modules/editProduct/selectors'

import { redirectIntents } from './SaveProductDialog'

export type OwnProps = {
    match: Match,
    ownerAddress: ?Address,
}

export type StateProps = ProductPageEditorProps & {
    availableStreams: StreamList,
    productError: ?ErrorInUi,
    streamsError: ?ErrorInUi,
    fetchingProduct: boolean,
    categories: CategoryList,
    category: ?Category,
    editPermission: boolean,
    publishPermission: boolean,
    imageUpload: ?File,
    editProduct: ?EditProduct,
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    confirmNoCoverImage: (Function) => void,
    setImageToUploadProp: (File) => void,
    openPriceDialog: (PriceDialogProps) => void,
    onEditProp: (string, any) => void,
    initEditProductProp: () => void,
    resetEditProductProp: () => void,
    getStreamsProp: () => void,
    getCategoriesProp: () => void,
    getUserProductPermissions: (ProductId) => void,
    showSaveDialog: (ProductId, string) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class EditProductPage extends Component<Props> {
    componentDidMount() {
        this.props.resetEditProductProp()
        this.props.getProductById(this.props.match.params.id)
        this.props.getUserProductPermissions(this.props.match.params.id)
        this.props.getStreamsProp()
        this.props.getCategoriesProp()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product && !prevProps.editProduct) {
            this.props.initEditProductProp()
        }
    }

    confirmCoverImageBeforeSaving = (redirectIntent: string) => {
        const { product,
            imageUpload,
            confirmNoCoverImage,
            showSaveDialog } = this.props

        if (product) {
            if (!product.imageUrl && !imageUpload) {
                confirmNoCoverImage(() => showSaveDialog(product.id || '', redirectIntent))
            } else {
                showSaveDialog(product.id || '', redirectIntent)
            }
        }
    }

    render() {
        const {
            product,
            category,
            streams,
            availableStreams,
            fetchingProduct,
            fetchingStreams,
            setImageToUploadProp,
            openPriceDialog,
            onEditProp,
            ownerAddress,
            categories,
            editPermission,
            publishPermission,
        } = this.props

        const toolbarActions = {}
        if (editPermission) {
            toolbarActions.saveAndExit = {
                title: 'Save & Exit',
                onClick: () => this.confirmCoverImageBeforeSaving(redirectIntents.MY_PRODUCTS),
            }
        }

        if (publishPermission) {
            toolbarActions.publish = {
                title: 'Publish',
                color: 'primary',
                onClick: () => this.confirmCoverImageBeforeSaving(redirectIntents.PUBLISH),
            }
        }

        return !!product && !!editPermission && (
            <ProductPageEditorComponent
                product={product}
                streams={streams}
                category={category}
                categories={categories}
                availableStreams={availableStreams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                toolbarActions={toolbarActions}
                setImageToUpload={setImageToUploadProp}
                openPriceDialog={(props) => openPriceDialog({
                    ...props,
                    ownerAddressReadOnly: true,
                    productId: product.id,
                    requireOwnerIfDeployed: true,
                })}
                onEdit={onEditProp}
                ownerAddress={ownerAddress}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectStreams(state),
    availableStreams: selectAvailableStreams(state),
    fetchingProduct: selectFetchingProduct(state),
    productError: selectProductError(state),
    fetchingStreams: selectFetchingStreams(state),
    streamsError: selectStreamsError(state),
    ownerAddress: selectAccountId(state),
    isLoggedIn: false, // TODO: this is not needed when the new edit view is ready
    isProductSubscriptionValid: false, // TODO: this is not needed when the new edit view is ready
    categories: selectAllCategories(state),
    category: selectCategory(state),
    editPermission: selectProductEditPermission(state),
    publishPermission: selectProductPublishPermission(state),
    imageUpload: selectImageToUpload(state),
    editProduct: selectEditProduct(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    confirmNoCoverImage: (onContinue: Function) => dispatch(showModal(CONFIRM_NO_COVER_IMAGE, {
        onContinue,
        closeOnContinue: false,
    })),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    openPriceDialog: (props: PriceDialogProps) => dispatch(showModal(SET_PRICE, props)),
    onEditProp: (field: string, value: any) => dispatch(updateEditProductField(field, value)),
    initEditProductProp: () => dispatch(initEditProduct()),
    resetEditProductProp: () => dispatch(resetEditProduct()),
    getStreamsProp: () => dispatch(getStreams()),
    getCategoriesProp: () => dispatch(getCategories()),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
    showSaveDialog: (productId: ProductId, redirectIntent: string) => dispatch(showModal(SAVE_PRODUCT, {
        productId,
        redirectIntent,
        requireOwnerIfDeployed: true,
    })),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
