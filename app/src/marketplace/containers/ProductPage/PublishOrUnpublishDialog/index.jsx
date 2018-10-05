// @flow

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import type { ProductId, Product, ProductState, SmartContractProduct } from '$mp/flowtype/product-types'
import { initPublish } from '$mp/modules/publishDialog/actions'
import { getProductFromContract } from '$mp/modules/contractProduct/actions'
import { productStates } from '$mp/utils/constants'
import { formatPath } from '$mp/utils/url'
import links from '$mp/../links'
import withContractProduct from '$mp/containers/WithContractProduct'
import { isPaidProduct } from '$mp/utils/product'

import UnpublishDialog from './UnpublishDialog'
import PublishDialog from './PublishDialog'

type StateProps = {}

type DispatchProps = {
    getProductFromContract: (ProductId) => void,
    onCancel: () => void,
    initPublish: (ProductId) => void,
    redirectBackToProduct: (ProductId) => void,
}

export type OwnProps = {
    productId: ProductId,
    product: Product,
    contractProduct: ?SmartContractProduct,
    redirectOnCancel: boolean,
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
                    startingState: isPaidProduct(product) && !!contractProduct ? contractProduct.state : product.state,
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
            const isPaid = isPaidProduct(product)

            // Store the initial state of deployment because it will change in the completion phase
            if (!this.state.startingState || (isPaid && !!contractProduct)) {
                this.setState({
                    startingState: isPaid && !!contractProduct ? contractProduct.state : product.state,
                })
            }
        }
    }

    render() {
        const { product } = this.props

        if (product) {
            return (this.state.startingState === productStates.DEPLOYED) ?
                <UnpublishDialog {...this.props} /> :
                <PublishDialog {...this.props} />
        }

        return null
    }
}

export const mapStateToProps = (): StateProps => ({})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductFromContract: (id: ProductId) => dispatch(getProductFromContract(id)),
    initPublish: (id: ProductId) => dispatch(initPublish(id)),
    onCancel: () => dispatch(replace(formatPath(links.products, ownProps.productId))),
    redirectBackToProduct: (productId: ProductId) => dispatch(replace(formatPath(links.products, productId || ''))),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PublishOrUnpublishDialog))
