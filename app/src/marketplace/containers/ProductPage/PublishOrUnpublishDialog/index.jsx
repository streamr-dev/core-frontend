// @flow

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import type { ProductId, Product, ProductState, SmartContractProduct } from '$mp/flowtype/product-types'
import type { StoreState } from '$mp/flowtype/store-state'
import { initPublish } from '$mp/modules/publishDialog/actions'
import { getProductFromContract } from '$mp/modules/contractProduct/actions'
import { productStates } from '$mp/utils/constants'
import { formatPath } from '$mp/utils/url'
import links from '$mp/../links'
import withContractProduct from '$mp/containers/WithContractProduct'
import NoStreamsWarningDialog from '$mp/components/Modal/NoStreamsWarningDialog'
import { selectFetchingProduct } from '$mp/modules/product/selectors'

import UnpublishDialog from './UnpublishDialog'
import PublishDialog from './PublishDialog'

type StateProps = {
    fetchingProduct: boolean,
}

type DispatchProps = {
    getProductFromContract: (ProductId) => void,
    onCancel: () => void,
    initPublish: (ProductId) => void,
    redirectToEditProduct: () => void,
}

export type OwnProps = {
    productId: ProductId,
    product: Product,
    contractProduct: ?SmartContractProduct,
}

type Props = StateProps & DispatchProps & OwnProps

type State = {
    startingState: ?ProductState,
}

export class PublishOrUnpublishDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        const { product, contractProduct, productId, initPublish: initPublishProp } = this.props

        initPublishProp(productId)

        if (product) {
            // Store the initial state of deployment because it will change in the completion phase
            if (!this.state.startingState) {
                this.state = {
                    startingState: contractProduct ? contractProduct.state : product.state,
                }
            }
        }
    }

    state = {
        startingState: null,
    }

    componentWillReceiveProps(nextProps: Props) {
        const { product, contractProduct } = nextProps

        if (product) {
            // Store the initial state of deployment because it will change in the completion phase
            if (!this.state.startingState || contractProduct) {
                this.setState({
                    startingState: contractProduct ? contractProduct.state : product.state,
                })
            }
        }
    }

    render() {
        const { fetchingProduct, product, onCancel, redirectToEditProduct } = this.props

        if (fetchingProduct || (product && product.streams.length <= 0)) {
            return (
                <NoStreamsWarningDialog
                    waiting={fetchingProduct}
                    onClose={onCancel}
                    onContinue={redirectToEditProduct}
                />
            )
        }

        if (product) {
            return (this.state.startingState === productStates.DEPLOYED) ?
                <UnpublishDialog {...this.props} /> :
                <PublishDialog {...this.props} />
        }

        return null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    fetchingProduct: selectFetchingProduct(state),
})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductFromContract: (id: ProductId) => dispatch(getProductFromContract(id)),
    initPublish: (id: ProductId) => dispatch(initPublish(id)),
    redirectToEditProduct: () => dispatch(replace(formatPath(links.products, ownProps.productId, 'edit'))),
    onCancel: () => dispatch(replace(formatPath(links.products, ownProps.productId))),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PublishOrUnpublishDialog))
