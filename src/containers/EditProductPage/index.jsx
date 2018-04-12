// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageEditorComponent from '../../components/ProductPageEditor'
import type { Props as ProductPageEditorProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'
import type { PriceDialogProps } from '../../components/SetPriceDialog'

import { getProductById } from '../../modules/product/actions'
import { initEditProduct, updateEditProductField, updateEditProductAndRedirect } from '../../modules/editProduct/actions'
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
import { selectAccountId } from '../../modules/web3/selectors'
import links from '../../links'
import { SET_PRICE } from '../../utils/modals'

export type OwnProps = {
    match: Match,
    ownerAddress: ?Address,
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
    openPriceDialog: (PriceDialogProps) => void,
    onEditProp: (string, any) => void,
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
            streams,
            fetchingProduct,
            fetchingStreams,
            onPublish,
            onSaveAndExit,
            setImageToUploadProp,
            openPriceDialog,
            onEditProp,
            ownerAddress,
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
                openPriceDialog={openPriceDialog}
                onEdit={onEditProp}
                ownerAddress={ownerAddress}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectStreams(state),
    fetchingProduct: selectFetchingProduct(state),
    productError: selectProductError(state),
    fetchingStreams: selectFetchingStreams(state),
    streamsError: selectStreamsError(state),
    ownerAddress: selectAccountId(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    onPublish: () => dispatch(updateEditProductAndRedirect(formatPath(links.products, ownProps.match.params.id, 'publish'))),
    onSaveAndExit: () => dispatch(updateEditProductAndRedirect(formatPath(links.myProducts))),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    openPriceDialog: (props: PriceDialogProps) => dispatch(showModal(SET_PRICE, props)),
    onEditProp: (field: string, value: any) => dispatch(updateEditProductField(field, value)),
    initEditProductProp: () => dispatch(initEditProduct()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
