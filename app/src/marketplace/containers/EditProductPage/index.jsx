// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { goBack, push, replace } from 'react-router-redux'
import type { Match } from 'react-router-dom'

import type { StoreState } from '../../flowtype/store-state'
import type { ProductId, EditProduct, SmartContractProduct, Product } from '../../flowtype/product-types'
import type { Address } from '../../flowtype/web3-types'
import type { PriceDialogProps } from '../../components/Modal/SetPriceDialog'
import type { StreamList } from '../../flowtype/stream-types'
import type { CategoryList, Category } from '../../flowtype/category-types'
import type { OnUploadError } from '../../components/ImageUpload'
import type { User } from '../../flowtype/user-types'

import ProductPageEditorComponent from '../../components/ProductPageEditor'
import links from '../../links'
import withI18n from '../WithI18n'

import { selectContractProduct } from '../../modules/contractProduct/selectors'
import { getProductById } from '../../modules/product/actions'
import {
    resetEditProduct,
    initEditProduct,
    updateEditProductField,
    setImageToUpload,
    createProductAndRedirect,
    initNewProduct,
} from '../../modules/editProduct/actions'
import { getStreams } from '../../modules/streams/actions'
import { showModal } from '../../modules/modals/actions'
import { getCategories } from '../../modules/categories/actions'
import { getUserProductPermissions } from '../../modules/user/actions'
import { getProductFromContract } from '../../modules/contractProduct/actions'
import {
    selectFetchingProduct,
    selectProductError,
    selectFetchingStreams,
    selectStreamsError,
    selectProduct,
} from '../../modules/product/selectors'
import { selectAccountId } from '../../modules/web3/selectors'
import { selectAllCategories, selectFetchingCategories } from '../../modules/categories/selectors'
import {
    selectProductEditPermission,
    selectUserData,
} from '../../modules/user/selectors'
import { SET_PRICE, CONFIRM_NO_COVER_IMAGE, SAVE_PRODUCT } from '../../utils/modals'
import { selectStreams as selectAvailableStreams } from '../../modules/streams/selectors'
import {
    selectEditProduct,
    selectStreams,
    selectCategory,
    selectImageToUpload,
} from '../../modules/editProduct/selectors'
import { productStates, notificationIcons } from '../../utils/constants'
import { formatPath } from '../../utils/url'
import { areAddressesEqual } from '../../utils/smartContract'
import { arePricesEqual } from '../../utils/price'
import { isPaidProduct } from '../../utils/product'
import { hasKnownHistory } from '../../utils/history'
import { editProductValidator } from '../../validators'
import { notifyErrors as notifyErrorsHelper } from '../../utils/validate'
import { showNotification as showNotificationAction } from '../../modules/notifications/actions'

export type OwnProps = {
    match: Match,
    ownerAddress: ?Address,
    translate: (key: string, options: any) => string,
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
    confirmNoCoverImage: (Function) => void,
    setImageToUploadProp: (File) => void,
    openPriceDialog: (PriceDialogProps) => void,
    onEditProp: (string, any) => void,
    initEditProductProp: () => void,
    getUserProductPermissions: (ProductId) => void,
    showSaveDialog: (ProductId, Function, boolean) => void,
    onCancel: (ProductId) => void,
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

export class EditProductPage extends Component<Props> {
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
        const { translate } = this.props

        if (product.state === productStates.NOT_DEPLOYED) {
            return translate('editProductPage.save')
        }

        if (product.state === productStates.DEPLOYED && this.isWeb3Required()) {
            return translate('editProductPage.republish')
        }

        return translate('editProductPage.update')
    }

    getPublishButtonTitle = (product: EditProduct) => {
        const { translate } = this.props

        switch (product.state) {
            case productStates.DEPLOYED:
                return translate('editProductPage.unpublish')
            case productStates.DEPLOYING:
                return translate('editProductPage.publishing')
            case productStates.UNDEPLOYING:
                return translate('editProductPage.unpublishing')
            case productStates.NOT_DEPLOYED:
            default:
                return translate('editProductPage.publish')
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
                    className: 'hidden-xs-down',
                }
            }
            return toolbarActions
        }

        // Creating a product, rather than editing an existing product:
        const { onSaveAndExit, onPublish, translate } = this.props
        return {
            saveAndExit: {
                title: translate('editProductPage.save'),
                onClick: () => this.validateProductBeforeSaving(onSaveAndExit),
            },
            publish: {
                title: translate('editProductPage.publish'),
                color: 'primary',
                onClick: () => this.validateProductBeforeSaving(onPublish),
                className: 'hidden-xs-down',
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

    isEdit = () => {
        if (!!this.props.match.params.id && this.props.match.params.id.length > 0) {
            return true
        }
        return false
    }

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
        const { confirmNoCoverImage, editProduct, imageUpload } = this.props
        if (editProduct && !editProduct.imageUrl && !imageUpload) {
            return confirmNoCoverImage(action)
        }
        return action()
    }

    confirmCoverImageBeforeSaving = (nextAction: () => any) => {
        const { product, editProduct, showSaveDialog } = this.props
        if (product && editProduct && this.isEdit()) {
            this.askConfirmIfNeeded(() =>
                showSaveDialog(editProduct.id || '', nextAction, this.isWeb3Required()))
        } else {
            this.askConfirmIfNeeded(nextAction)
        }
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
            openPriceDialog,
            onEditProp,
            onCancel,
            ownerAddress,
            categories,
            user,
            onUploadError,
        } = this.props

        return editProduct && (
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
                openPriceDialog={(props) => openPriceDialog({
                    ...props,
                    productId: editProduct.id,
                    isFree: editProduct.isFree,
                    requireOwnerIfDeployed: true,
                })}
                onUploadError={onUploadError}
                onEdit={onEditProp}
                onCancel={onCancel}
                ownerAddress={ownerAddress}
                user={user}
            />
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
    confirmNoCoverImage: (onContinue: Function) => dispatch(showModal(CONFIRM_NO_COVER_IMAGE, {
        onContinue,
        closeOnContinue: false,
    })),
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
    onCancel: () => {
        dispatch(resetEditProduct())
        const browserHistoryBack = hasKnownHistory() ? goBack() : push(formatPath(links.main))

        dispatch(browserHistoryBack)
    },
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
    openPriceDialog: (props: PriceDialogProps) => dispatch(showModal(SET_PRICE, {
        ...props,
    })),
    onReset: () => dispatch(resetEditProduct()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withI18n(EditProductPage))
