// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import type { Match } from 'react-router-dom'
import { I18n } from 'react-redux-i18n'

import type { StoreState } from '$shared/flowtype/store-state'
import type { ProductId, EditProduct, SmartContractProduct, Product } from '$mp/flowtype/product-types'
import type { Address } from '$shared/flowtype/web3-types'
import type { PriceDialogProps } from '$mp/components/Modal/SetPriceDialog'
import type { StreamList } from '$shared/flowtype/stream-types'
import type { CategoryList, Category } from '$mp/flowtype/category-types'
import type { OnUploadError } from '$shared/components/ImageUpload'
import type { User } from '$shared/flowtype/user-types'

import Modal from '$shared/components/Modal'
import ConfirmNoCoverImageDialog from '$mp/components/Modal/ConfirmNoCoverImageDialog'
import ProductPageEditorComponent from '$mp/components/ProductPageEditor'
import Layout from '$mp/components/Layout'
import links from '$mp/../links'

import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import { getProductById, getUserProductPermissions } from '$mp/modules/product/actions'
import {
    resetEditProduct,
    initEditProduct,
    updateEditProductField,
    setImageToUpload,
    createProductAndRedirect,
    initNewProduct,
} from '$mp/modules/editProduct/actions'
import { getStreams } from '$mp/modules/streams/actions'
import { showModal } from '$mp/modules/modals/actions'
import { getCategories } from '$mp/modules/categories/actions'
import { getProductFromContract } from '$mp/modules/contractProduct/actions'
import {
    selectFetchingProduct,
    selectProductError,
    selectFetchingStreams,
    selectStreamsError,
    selectProduct,
    selectProductEditPermission,
} from '$mp/modules/product/selectors'
import { selectAccountId } from '$mp/modules/web3/selectors'
import { selectAllCategories, selectFetchingCategories } from '$mp/modules/categories/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import { SAVE_PRODUCT } from '$mp/utils/modals'
import { selectStreams as selectAvailableStreams } from '$mp/modules/streams/selectors'
import {
    selectEditProduct,
    selectStreams,
    selectCategory,
    selectImageToUpload,
} from '$mp/modules/editProduct/selectors'
import { notificationIcons } from '$mp/utils/constants'
import { productStates } from '$shared/utils/constants'
import { formatPath } from '$shared/utils/url'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { arePricesEqual } from '$mp/utils/price'
import { isPaidProduct } from '$mp/utils/product'
import { editProductValidator } from '$mp/validators'
import { notifyErrors as notifyErrorsHelper } from '$mp/utils/validate'
import { showNotification as showNotificationAction } from '$mp/modules/notifications/actions'

export type OwnProps = {
    match: Match,
    ownerAddress: ?Address,
}

export type StateProps = {
    contractProduct: ?SmartContractProduct,
    availableStreams: StreamList,
    fetchingProduct: boolean,
    categories: CategoryList,
    category: ?Category,
    editPermission: boolean,
    imageUpload: ?File,
    streams: StreamList,
    fetchingStreams: boolean,
    product: ?Product,
    editProduct: ?Product,
    user: ?User,
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    getContractProduct: (id: ProductId) => void,
    setImageToUploadProp: (File) => void,
    onEditProp: (string, any) => void,
    initEditProductProp: () => void,
    getUserProductPermissions: (ProductId) => void,
    showSaveDialog: (ProductId, Function, boolean) => void,
    notifyErrors: (errors: Object) => void,
    onUploadError: OnUploadError,
    initProduct: () => void,
    getCategories: () => void,
    getStreams: () => void,
    onPublish: () => void,
    onSaveAndExit: () => void,
    redirect: (...any) => void,
    noHistoryRedirect: (...any) => void,
    onReset: () => void,
}

type Props = OwnProps & StateProps & DispatchProps

type State = {
    onConfirmNoCoverImage: ?() => void,
}

export class EditProductPage extends Component<Props, State> {
    state = {
        onConfirmNoCoverImage: null,
    }

    componentDidMount() {
        const { match } = this.props
        this.props.onReset()
        this.props.getCategories()
        this.props.getStreams()
        if (this.isEdit()) {
            this.props.getProductById(match.params.id)
            this.props.getUserProductPermissions(match.params.id)
            this.props.getContractProduct(match.params.id)
        } else {
            this.props.initProduct()
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.editProduct) {
            this.getUpdateButtonTitle(nextProps.editProduct)
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.isEdit() && prevProps.product && !prevProps.editProduct) {
            this.props.initEditProductProp()
        }
    }

    componentWillUnmount() {
        this.props.onReset()
    }

    getUpdateButtonTitle = (product: EditProduct) => {
        if (product.state === productStates.NOT_DEPLOYED) {
            return I18n.t('editProductPage.save')
        }

        if (product.state === productStates.DEPLOYED && this.isWeb3Required()) {
            return I18n.t('editProductPage.republish')
        }

        return I18n.t('editProductPage.update')
    }

    getPublishButtonTitle = (product: EditProduct) => {
        switch (product.state) {
            case productStates.DEPLOYED:
                return I18n.t('editProductPage.unpublish')
            case productStates.DEPLOYING:
                return I18n.t('editProductPage.publishing')
            case productStates.UNDEPLOYING:
                return I18n.t('editProductPage.unpublishing')
            case productStates.NOT_DEPLOYED:
            default:
                return I18n.t('editProductPage.publish')
        }
    }

    getToolBarActions = () => {
        if (this.isEdit()) {
            const { editPermission, redirect, noHistoryRedirect, editProduct } = this.props
            const toolbarActions = {}
            if (editProduct && editPermission) {
                toolbarActions.saveAndExit = {
                    title: this.getUpdateButtonTitle(editProduct),
                    disabled: this.isUpdateButtonDisabled(editProduct),
                    onClick: () => this.validateProductBeforeSaving(() => redirect(links.myProducts)),
                }
            }

            if (editProduct) {
                toolbarActions.publish = {
                    title: this.getPublishButtonTitle(editProduct),
                    disabled: this.isPublishButtonDisabled(editProduct),
                    color: 'primary',
                    onClick: () => this.validateProductBeforeSaving((id) => noHistoryRedirect(links.products, id, 'publish')),
                    className: 'd-none d-sm-inline-block',
                }
            }
            return toolbarActions
        }

        // Creating a product, rather than editing an existing product:
        const { onSaveAndExit, onPublish } = this.props
        return {
            saveAndExit: {
                title: I18n.t('editProductPage.save'),
                onClick: () => this.validateProductBeforeSaving(onSaveAndExit),
            },
            publish: {
                title: I18n.t('editProductPage.publish'),
                color: 'primary',
                onClick: () => this.validateProductBeforeSaving(onPublish),
                className: 'd-none d-sm-block',
            },
        }
    }

    isPublishButtonDisabled = (product: EditProduct) =>
        product.state === productStates.DEPLOYING || product.state === productStates.UNDEPLOYING

    isUpdateButtonDisabled = (product: EditProduct) =>
        product.state === productStates.DEPLOYING || product.state === productStates.UNDEPLOYING

    isWeb3Required = (): boolean => {
        const { product, contractProduct, editProduct } = this.props
        return !!product && !!editProduct && isPaidProduct(product) && !!contractProduct && (
            !areAddressesEqual(product.beneficiaryAddress, editProduct.beneficiaryAddress) ||
            !arePricesEqual(product.pricePerSecond, editProduct.pricePerSecond)
        )
    }

    isEdit = () => !!this.props.match.params.id

    validateProductBeforeSaving = (nextAction: Function) => {
        const { editProduct, notifyErrors } = this.props

        if (editProduct) {
            editProductValidator(editProduct)
                .then(() => {
                    this.confirmCoverImageBeforeSaving(nextAction)
                }, notifyErrors)
        }
    }

    askConfirmIfNeeded = (action: Function) => {
        const { editProduct, imageUpload } = this.props
        if (editProduct && !editProduct.imageUrl && !imageUpload) {
            this.setState({
                onConfirmNoCoverImage: action,
            })
        } else {
            action()
        }
    }

    confirmCoverImageBeforeSaving = (nextAction: () => any) => {
        const { product, editProduct, showSaveDialog } = this.props
        if (product && editProduct && this.isEdit()) {
            this.askConfirmIfNeeded(() => {
                showSaveDialog(editProduct.id || '', nextAction, this.isWeb3Required())
            })
        } else {
            this.askConfirmIfNeeded(nextAction)
        }
    }

    closeConfirmNoCoverImageDialog = () => {
        this.setState({
            onConfirmNoCoverImage: null,
        })
    }

    render() {
        const {
            editProduct,
            category,
            streams,
            availableStreams,
            fetchingProduct,
            fetchingStreams,
            setImageToUploadProp,
            onEditProp,
            ownerAddress,
            categories,
            user,
            onUploadError,
        } = this.props

        const { onConfirmNoCoverImage } = this.state

        return editProduct && (
            <Layout>
                <ProductPageEditorComponent
                    isPriceEditable={!this.isEdit() || isPaidProduct(editProduct)}
                    product={editProduct}
                    streams={streams}
                    category={category}
                    categories={categories}
                    availableStreams={availableStreams}
                    fetchingStreams={fetchingProduct || fetchingStreams}
                    toolbarActions={this.getToolBarActions()}
                    setImageToUpload={setImageToUploadProp}
                    onUploadError={onUploadError}
                    onEdit={onEditProp}
                    ownerAddress={ownerAddress}
                    user={user}
                />
                {onConfirmNoCoverImage && (
                    <Modal>
                        <ConfirmNoCoverImageDialog
                            onContinue={onConfirmNoCoverImage}
                            closeOnContinue={false}
                            onClose={this.closeConfirmNoCoverImageDialog}
                        />
                    </Modal>
                )}
            </Layout>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    editProduct: selectEditProduct(state),
    contractProduct: selectContractProduct(state),
    streams: selectStreams(state),
    availableStreams: selectAvailableStreams(state),
    fetchingProduct: selectFetchingProduct(state),
    productError: selectProductError(state),
    fetchingStreams: selectFetchingStreams(state),
    streamsError: selectStreamsError(state),
    ownerAddress: selectAccountId(state),
    categories: selectAllCategories(state),
    category: selectCategory(state),
    editPermission: selectProductEditPermission(state),
    imageUpload: selectImageToUpload(state),
    fetchingCategories: selectFetchingCategories(state),
    user: selectUserData(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    getContractProduct: (id: ProductId) => dispatch(getProductFromContract(id)),
    onUploadError: (errorMessage: string) => dispatch(showNotificationAction(errorMessage, notificationIcons.ERROR)),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    onEditProp: (field: string, value: any) => dispatch(updateEditProductField(field, value)),
    initEditProductProp: () => dispatch(initEditProduct()),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
    showSaveDialog: (productId: ProductId, redirect: Function, requireWeb3: boolean) => dispatch(showModal(SAVE_PRODUCT, {
        productId,
        redirect,
        requireOwnerIfDeployed: true,
        requireWeb3,
    })),
    notifyErrors: (errors: Object) => {
        notifyErrorsHelper(dispatch, errors)
    },
    initProduct: () => dispatch(initNewProduct()),
    getCategories: () => dispatch(getCategories(true)),
    getStreams: () => dispatch(getStreams()),
    redirect: (...params) => dispatch(push(formatPath(...params))),
    noHistoryRedirect: (...params) => dispatch(replace(formatPath(...params))),
    onPublish: () => dispatch(createProductAndRedirect((id) => formatPath(links.products, id, 'publish'))),
    onSaveAndExit: () => dispatch(createProductAndRedirect((id) => formatPath(links.products, id))),
    onReset: () => dispatch(resetEditProduct()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
