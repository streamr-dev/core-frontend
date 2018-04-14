// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Match } from 'react-router-dom'

import type { StoreState } from '../../../flowtype/store-state'
import type { ProductId, Product } from '../../../flowtype/product-types'
import { initPublish } from '../../../modules/publishDialog/actions'
import { getProductFromContract } from '../../../modules/product/actions'
import { selectProduct } from '../../../modules/publishDialog/selectors'
import { productStates } from '../../../utils/constants'
import UnpublishDialog from '../UnpublishDialog'
import PublishDialog from '../PublishDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'

type StateProps = {
    product: ?Product,
}

type DispatchProps = {
    getProductFromContract: (ProductId) => void,
    initPublish: (ProductId) => void,
    redirectBackToProduct: () => void,
}

export type OwnProps = {
    match: Match,
}

type Props = StateProps & DispatchProps & OwnProps

class PublishOrUnpublishDialog extends React.Component<Props> {
    componentDidMount() {
        this.props.getProductFromContract(this.props.match.params.id)
        this.props.initPublish(this.props.match.params.id)
    }

    componentWillReceiveProps(nextProps: Props) {
        const { product, redirectBackToProduct } = nextProps

        // if product is being deployed or undeployed, redirect to product page
        if (product) {
            if (product.state !== productStates.DEPLOYED && product.state !== productStates.NOT_DEPLOYED) {
                redirectBackToProduct()
            }
        }
    }

    render() {
        const { product } = this.props

        if (product) {
            return (product.state === productStates.DEPLOYED) ?
                <UnpublishDialog {...this.props} /> :
                <PublishDialog {...this.props} />
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductFromContract: (id: ProductId) => dispatch(getProductFromContract(id)),
    initPublish: (id: ProductId) => dispatch(initPublish(id)),
    redirectBackToProduct: () => dispatch(push(formatPath(links.products, ownProps.match.params.id))),
})

export default connect(mapStateToProps, mapDispatchToProps)(PublishOrUnpublishDialog)
