// @flow

import React from 'react'
import { connect } from 'react-redux'

import ModalPortal from '$shared/components/ModalPortal'
import type { ProductId, Product, ProductState, SmartContractProduct } from '$mp/flowtype/product-types'
import { initPublish } from '$mp/modules/deprecated/publishDialog/actions'
import { productStates } from '$shared/utils/constants'
import withContractProduct from '$mp/containers/deprecated/WithContractProduct'
import { isPaidProduct } from '$mp/utils/product'
import UnpublishDialog from './UnpublishDialog'
import PublishDialog from './PublishDialog'

type StateProps = {
}

type DispatchProps = {
    initPublish: (ProductId) => void,
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
        const { contractProduct: oldContractProduct } = this.props

        if (product) {
            const isPaid = isPaidProduct(product)

            // Store the initial state of deployment because it will change in the completion phase
            if (!this.state.startingState || (isPaid && (
                (!oldContractProduct && !!contractProduct) ||
                (!!oldContractProduct && !!contractProduct && oldContractProduct.state !== contractProduct.state)))
            ) {
                this.setState({
                    startingState: isPaid && !!contractProduct ? contractProduct.state : product.state,
                })
            }
        }
    }

    render() {
        if (this.props.product) {
            return (
                <ModalPortal>
                    {this.state.startingState === productStates.DEPLOYED ? (
                        <UnpublishDialog {...this.props} />
                    ) : (
                        <PublishDialog {...this.props} />
                    )}
                </ModalPortal>
            )
        }

        return null
    }
}

export const mapStateToProps = (): StateProps => ({})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    initPublish: (id: ProductId) => dispatch(initPublish(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PublishOrUnpublishDialog))
