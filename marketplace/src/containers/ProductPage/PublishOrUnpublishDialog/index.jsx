// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import type { ProductId, Product, ProductState, SmartContractProduct } from '../../../flowtype/product-types'
import { initPublish } from '../../../modules/publishDialog/actions'
import { getProductFromContract } from '../../../modules/contractProduct/actions'
import { productStates } from '../../../utils/constants'
import UnpublishDialog from '../UnpublishDialog'
import PublishDialog from '../PublishDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
import withContractProduct from '../../WithContractProduct'

type StateProps = {}

type DispatchProps = {
    getProductFromContract: (ProductId) => void,
    onCancel: () => void,
    initPublish: (productId: ProductId) => void,
    redirectBackToProduct: (productId: ProductId) => void,
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

class PublishOrUnpublishDialog extends React.Component<Props, State> {
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
        const { product } = this.props

        if (product) {
            return (this.state.startingState === productStates.DEPLOYED) ?
                <UnpublishDialog {...this.props} /> :
                <PublishDialog {...this.props} />
        }

        return null
    }
}

const mapStateToProps = (): StateProps => ({})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductFromContract: (id: ProductId) => dispatch(getProductFromContract(id)),
    initPublish: (id: ProductId) => dispatch(initPublish(id)),
    onCancel: () => dispatch(push(formatPath(links.products, ownProps.productId))),
    redirectBackToProduct: (productId: ProductId) => dispatch(push(formatPath(links.products, productId || ''))),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PublishOrUnpublishDialog))
