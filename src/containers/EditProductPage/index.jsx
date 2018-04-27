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
import { resetEditProduct, initEditProduct, updateEditProductField, updateEditProductAndRedirect } from '../../modules/editProduct/actions'
import { getStreams } from '../../modules/streams/actions'
import { formatPath } from '../../utils/url'
import { arePricesEqual } from '../../utils/price'
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
import { selectProductSharePermission } from '../../modules/user/selectors'
import links from '../../links'
import { SET_PRICE, CONFIRM_NO_COVER_IMAGE } from '../../utils/modals'
// import { productStates } from '../../utils/constants'
import { selectStreams as selectAvailableStreams } from '../../modules/streams/selectors'
import { selectEditProduct } from '../../modules/editProduct/selectors'

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
    imageUpload: ?File,
    editProduct: ?EditProduct,
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
    resetEditProductProp: () => void,
    getStreamsProp: () => void,
    getCategoriesProp: () => void,
    getUserProductPermissions: (ProductId) => void,
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

    confirmCoverImageBeforeSaving = (nextAction: Function) => {
        const { product, imageUpload, confirmNoCoverImage } = this.props

        if (product) {
            if (!product.imageUrl && !imageUpload) {
                confirmNoCoverImage(() => this.doPriceTransaction(nextAction))
            } else {
                this.doPriceTransaction(() => this.doPriceTransaction(nextAction))
            }
        }
    }

    doPriceTransaction = (nextAction: Function) => {
        const { product, editProduct } = this.props
        let proceedToNext = false

        if (product && editProduct) {
            if (/* product.state === productStates.DEPLOYED && */ !arePricesEqual(product.pricePerSecond, editProduct.pricePerSecond)) {
                alert('transaction')
                proceedToNext = false
            }
        }

        if (proceedToNext) {
            nextAction()
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
        } = this.props

        return !!product && !!editPermission && (
            <ProductPageEditorComponent
                product={product}
                streams={streams}
                category={category}
                categories={categories}
                availableStreams={availableStreams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                toolbarActions={{
                    saveAndExit: {
                        title: 'Save & Exit',
                        onClick: () => this.confirmCoverImageBeforeSaving(onSaveAndExit),
                    },
                    publish: {
                        title: 'Publish',
                        color: 'primary',
                        onClick: () => this.confirmCoverImageBeforeSaving(onPublish),
                    },
                }}
                setImageToUpload={setImageToUploadProp}
                openPriceDialog={(props) => openPriceDialog({
                    ...props, disableOwnerAddress: true,
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
    editPermission: selectProductSharePermission(state),
    imageUpload: selectImageToUpload(state),
    editProduct: selectEditProduct(state),
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
    resetEditProductProp: () => dispatch(resetEditProduct()),
    getStreamsProp: () => dispatch(getStreams()),
    getCategoriesProp: () => dispatch(getCategories()),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
