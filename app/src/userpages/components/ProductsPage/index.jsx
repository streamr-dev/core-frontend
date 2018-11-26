// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

import Layout from '../Layout'
import links from '../../../links'
import { defaultColumns } from '../../utils/constants'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList } from '$mp/modules/myProductList/selectors'
import { productStates } from '$mp/utils/constants'
import Tile from '$shared/components/Tile'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'

import type { ProductList } from '$mp/flowtype/product-types'

import styles from './products.pcss'

export type StateProps = {
    products: ProductList,
}

export type DispatchProps = {
    getMyProducts: () => void,
}

type Props = StateProps & DispatchProps

const CreateProductButton = () => (
    <Button>
        <Link to={links.createProduct}>
            <Translate value="userpages.products.createProduct" />
        </Link>
    </Button>
)

class ProductsPage extends Component<Props> {
    componentDidMount() {
        this.props.getMyProducts()
    }

    render() {
        const { products } = this.props

        return (
            <Layout
                headerAdditionalComponent={<CreateProductButton />}
            >
                <Container>
                    {!products.length && (
                        <EmptyState
                            image={(
                                <img
                                    src={emptyStateIcon}
                                    srcSet={`${emptyStateIcon2x} 2x`}
                                    alt={I18n.t('error.notFound')}
                                />
                            )}
                        >
                            <Translate value="userpages.products.noProducts.title" />
                            <Translate value="userpages.products.noProducts.message" tag="small" />
                        </EmptyState>
                    )}
                    <Row>
                        {products.map((product) => (
                            <Col {...defaultColumns} key={product.id}>
                                <Tile
                                    imageUrl={product.imageUrl}
                                    link={product.id && `${links.products}/${product.id}`}
                                >
                                    <Tile.Title>{product.name}</Tile.Title>
                                    <Tile.Tag
                                        className={product.state === productStates.DEPLOYED ? styles.purple : styles.gray}
                                    >
                                        {
                                            product.state === productStates.DEPLOYED ?
                                                <Translate value="userpages.products.published" /> :
                                                <Translate value="userpages.products.draft" />
                                        }
                                    </Tile.Tag>
                                </Tile>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Layout>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    products: selectMyProductList(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getMyProducts: () => dispatch(getMyProducts()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductsPage)
