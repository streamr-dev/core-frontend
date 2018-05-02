// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'
import BN from 'bignumber.js'

import ProductPageEditorComponent from '../../components/ProductPageEditor'
import type { Props as ProductPageEditorProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'
import type { PriceDialogProps, PriceDialogResult } from '../../components/Modal/SetPriceDialog'
import type { StreamList } from '../../flowtype/stream-types'
import type { CategoryList, Category } from '../../flowtype/category-types'

import { getProductById } from '../../modules/product/actions'
import { initEditProduct, updateEditProductField, updateEditProductAndRedirect } from '../../modules/editProduct/actions'
import { getStreams } from '../../modules/streams/actions'
import { formatPath } from '../../utils/url'
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

import links from '../../links'
import { SET_PRICE, CONFIRM_NO_COVER_IMAGE } from '../../utils/modals'

import { selectStreams as selectAvailableStreams } from '../../modules/streams/selectors'
import { priceDialogValidator, type PriceDialogValidator } from '../../validators'
import type { Options } from '../../utils/validate'

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
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    confirmNoCoverImage: (Function) => void,
    onPublish: () => void,
    onSaveAndExit: () => void,
    setImageToUploadProp: (File) => void,
    openPriceDialog: (PriceDialogProps) => void,
    onEditProp: (string, any) => void,
    initEditProductProp: () => void,
    getStreamsProp: () => void,
    getCategoriesProp: () => void,
    getUserProductPermissions: (ProductId) => void,
    validatePriceDialog: PriceDialogValidator,
}

type Props = OwnProps & StateProps & DispatchProps

class EditProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
        this.props.getUserProductPermissions(this.props.match.params.id)
        this.props.getStreamsProp()
        this.props.getCategoriesProp()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product) {
            this.props.initEditProductProp()
        }
    }

    confirmCoverImageBeforeSaving = (nextAction: Function) => {
        const { product, imageUpload, confirmNoCoverImage } = this.props

        if (product) {
            if (!product.imageUrl && !imageUpload) {
                confirmNoCoverImage(nextAction)
            } else {
                nextAction()
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
            onPublish,
            onSaveAndExit,
            setImageToUploadProp,
            openPriceDialog,
            onEditProp,
            ownerAddress,
            categories,
            editPermission,
            validatePriceDialog,
            publishPermission,
        } = this.props

        const toolbarActions = {}
        if (editPermission) {
            toolbarActions.saveAndExit = {
                title: 'Save & Exit',
                onClick: () => this.confirmCoverImageBeforeSaving(onSaveAndExit),
            }
        }

        if (publishPermission) {
            toolbarActions.publish = {
                title: 'Publish',
                color: 'primary',
                onClick: () => this.confirmCoverImageBeforeSaving(onPublish),
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
                    ...props, disableOwnerAddress: true, isFree: product.isFree || BN(product.pricePerSecond).isEqualTo(0),
                })}
                onEdit={onEditProp}
                ownerAddress={ownerAddress}
                validatePriceDialog={validatePriceDialog}
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
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    onPublish: () => dispatch(updateEditProductAndRedirect(formatPath(links.products, ownProps.match.params.id, 'publish'))),
    confirmNoCoverImage: (onContinue: Function) => dispatch(showModal(CONFIRM_NO_COVER_IMAGE, {
        onContinue,
    })),
    onSaveAndExit: () => dispatch(updateEditProductAndRedirect(formatPath(links.myProducts))),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    openPriceDialog: (props: PriceDialogProps) => dispatch(showModal(SET_PRICE, props)),
    onEditProp: (field: string, value: any) => dispatch(updateEditProductField(field, value)),
    initEditProductProp: () => dispatch(initEditProduct()),
    getStreamsProp: () => dispatch(getStreams()),
    getCategoriesProp: () => dispatch(getCategories()),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
    validatePriceDialog: (p: PriceDialogResult, options?: Options) => dispatch(priceDialogValidator(p, options)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
