// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageEditorComponent from '../../components/ProductPageEditor'
import type { Props as ProductPageEditorProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'

import { getProductById } from '../../modules/product/actions'
import { initEditProduct, updateEditProductField, updateProductAndRedirect } from '../../modules/editProduct/actions'
import { formatPath } from '../../utils/url'
import { setImageToUpload } from '../../modules/createProduct/actions'
import { showModal } from '../../modules/modals/actions'
import {
    selectFetchingProduct,
    selectProduct,
    selectProductError,
    selectStreams,
    selectFetchingStreams,
    selectStreamsError,
} from '../../modules/product/selectors'
import links from '../../links'
import { selectAccountId } from '../../modules/web3/selectors'

export type OwnProps = {
    match: Match,
    accountEthAddress: ?Address,
}

export type StateProps = ProductPageEditorProps & {
    productError: ?ErrorInUi,
    streamsError: ?ErrorInUi,
    fetchingProduct: boolean
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    onPublish: () => void,
    onSaveAndExit: () => void,
    setImageToUploadProp: (File) => void,
    openPriceDialog: (Product, ?Address, (string, any) => void) => void,
    onEditProp: (field: string, value: any) => void,
    initEditProductProp: () => void,
}

type Props = OwnProps & StateProps & DispatchProps

class EditProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product) {
            this.props.initEditProductProp()
        }
    }

    render() {
        const {
            product,
            accountEthAddress,
            streams,
            fetchingProduct,
            fetchingStreams,
            onPublish,
            onSaveAndExit,
            setImageToUploadProp,
            openPriceDialog,
            onEditProp,
        } = this.props

        return !!product && (
            <ProductPageEditorComponent
                product={product}
                streams={streams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                toolbarActions={{
                    saveAndExit: {
                        title: 'Save & Exit',
                        onClick: onSaveAndExit,
                    },
                    publish: {
                        title: 'Publish',
                        color: 'primary',
                        onClick: onPublish,
                    },
                }}
                setImageToUpload={setImageToUploadProp}
                openPriceDialog={() => openPriceDialog(product, accountEthAddress, onEditProp)}
                onEdit={onEditProp}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    accountEthAddress: selectAccountId(state),
    streams: selectStreams(state),
    fetchingProduct: selectFetchingProduct(state),
    productError: selectProductError(state),
    fetchingStreams: selectFetchingStreams(state),
    streamsError: selectStreamsError(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    onPublish: () => dispatch(updateProductAndRedirect(formatPath(links.products, ownProps.match.params.id, 'publish'))),
    onSaveAndExit: () => dispatch(updateProductAndRedirect(formatPath(links.myProducts))),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    openPriceDialog: (product: Product, ownerAddress: ?Address, setProperty: (string, any) => void) => dispatch(showModal('SET_PRICE', {
        product,
        ownerAddress,
        setProperty,
    })),
    onEditProp: (field: string, value: any) => dispatch(updateEditProductField(field, value)),
    initEditProductProp: () => dispatch(initEditProduct()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
