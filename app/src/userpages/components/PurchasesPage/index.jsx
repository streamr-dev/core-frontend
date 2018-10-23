// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import Layout from '../Layout'
import links from '../../../links'
import { getMyPurchases } from '$mp/modules/myPurchaseList/actions'
import { selectMyPurchaseList, selectSubscriptions } from '$mp/modules/myPurchaseList/selectors'
import Tile from '$shared/components/Tile'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import { isActive } from '$mp/utils/time'
import routes from '$routes'

import type { ProductList, ProductSubscription } from '$mp/flowtype/product-types'

import styles from './purchases.pcss'

export type StateProps = {
    purchases: ProductList,
    subscriptions: Array<ProductSubscription>,
}

export type DispatchProps = {
    getMyPurchases: () => void,
}

type Props = StateProps & DispatchProps

const isSubscriptionActive = (subscription?: ProductSubscription): boolean => isActive((subscription && subscription.endsAt) || '')

class PurchasesPage extends Component<Props> {
    componentDidMount() {
        this.props.getMyPurchases()
    }

    render() {
        const { purchases, subscriptions } = this.props

        const cols = {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
        }

        return (
            <Layout>
                <Container>
                    {!purchases.length && (
                        <EmptyState
                            image={(
                                <img
                                    src={emptyStateIcon}
                                    srcSet={`${emptyStateIcon2x} 2x`}
                                    alt={I18n.t('error.notFound')}
                                />
                            )}
                            link={(
                                <Link to={routes.marketplace()} className="btn btn-special">
                                    <Translate value="userpages.purchases.noPurchases.hint" />
                                </Link>
                            )}
                        >
                            <Translate value="userpages.purchases.noPurchases.title" />
                            <Translate value="userpages.purchases.noPurchases.message" tag="small" />
                        </EmptyState>
                    )}
                    <Row>
                        {purchases.map((product) => {
                            const isActive = subscriptions && isSubscriptionActive(subscriptions.find((s) => s.product.id === product.id))

                            return (
                                <Col {...cols} key={product.id}>
                                    <Tile
                                        imageUrl={product.imageUrl}
                                        link={product.id && `${links.products}/${product.id}`}
                                    >
                                        <div className={styles.title}>{product.name}</div>
                                        <div className={styles.owner}>{product.owner}</div>
                                        <div
                                            className={
                                                cx(styles.status, {
                                                    [styles.active]: isActive,
                                                    [styles.expired]: !isActive,
                                                })}
                                        >
                                            {
                                                isActive ?
                                                    <Translate value="userpages.purchases.active" /> :
                                                    <Translate value="userpages.purchases.expired" />
                                            }
                                        </div>
                                    </Tile>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </Layout>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    purchases: selectMyPurchaseList(state),
    subscriptions: selectSubscriptions(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getMyPurchases: () => dispatch(getMyPurchases()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchasesPage)
