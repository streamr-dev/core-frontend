// @flow
import React, {Component} from 'react'
import { connect } from 'react-redux'

import type { StoreState, ProductStateEntity } from '../../flowtype/store-state'

import { getProductById } from '../Products/actions'
import { selectAllProducts } from '../Products/selectors'

type StateProps = {
    id: $ElementType<ProductStateEntity, 'id'>,
    fetching: boolean,
    product?: ?ProductStateEntity,
}

type DispatchProps = {
    getProduct: (id: string) => void,
}

type Props = StateProps & DispatchProps & {
    match: Object,
}

type State = {}

export class SingleProduct extends Component<Props, State> {
    componentWillMount() {
        const { id, product, fetching, getProduct } = this.props

        if (!product && !fetching) {
            getProduct(id)
        }
    }

    render() {
        const { product, fetching } = this.props

        return (
            <div>
                {!!(!fetching && product) && (
                    <div>
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState, ownProps: Props): StateProps => {
    const { id } = ownProps.match.params
    const products = selectAllProducts(state)

    const product = products && products.find((p) => p.id === id)

    return {
        id,
        fetching: product && product.fetching || false,
        product,
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProduct: (id: string) => dispatch(getProductById(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct)
