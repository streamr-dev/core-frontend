// @flow
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container } from '@streamr/streamr-layout'

import type { StoreState } from '../../flowtype/store-state'
import type { Product as ProductEntity, ProductId } from '../../flowtype/product-types'
import { selectCurrentProduct } from './selectors'
import { selectFetching } from '../../modules/product/selectors'
import { getProductById } from '../../modules/product/actions'

type StateProps = {
    id: ProductId,
    fetching: boolean,
    product?: ?ProductEntity,
}

type DispatchProps = {
    getProduct: (id: string) => void,
}

type Props = StateProps & DispatchProps & {
    match: Object,
}

type State = {}

export class Product extends Component<Props, State> {
    componentWillMount() {
        const { id, product, fetching, getProduct } = this.props

        if (!product && !fetching) {
            getProduct(id)
        }
    }

    render() {
        const { product, fetching } = this.props

        return (
            <Container>
                {!!(!fetching && product) && (
                    <div>
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                    </div>
                )}
            </Container>
        )
    }
}

const mapStateToProps = (state: StoreState, ownProps: Props): StateProps => {
    const { id } = ownProps.match.params
    const product = selectCurrentProduct(state, ownProps)

    return {
        id,
        fetching: selectFetching(state),
        product,
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProduct: (id: string) => dispatch(getProductById(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Product)
