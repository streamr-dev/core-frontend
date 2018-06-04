// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { formatPath } from '../../utils/url'
import links from '../../links'
import { getUserData } from '../../modules/user/actions'
import AccountPageComponent from '../../components/AccountPage'
import type { User } from '../../flowtype/user-types'
import { selectUserData } from '../../modules/user/selectors'
import type { StoreState } from '../../flowtype/store-state'

import type { ProductList, ProductId, ProductSubscription } from '../../flowtype/product-types'
import { getMyProducts } from '../../modules/myProductList/actions'
import { getMyPurchases } from '../../modules/myPurchaseList/actions'

import { selectMyProductList, selectFetchingMyProductList } from '../../modules/myProductList/selectors'
import { selectMyPurchaseList, selectFetchingMyPurchaseList, selectSubscriptions } from '../../modules/myPurchaseList/selectors'

export type AccountPageTab = 'purchases' | 'products'

type StateProps = {
    user: ?User,
    myProducts: ProductList,
    isFetchingMyProducts: boolean,
    myPurchases: ProductList,
    isFetchingMyPurchases: boolean,
    subscriptions: Array<ProductSubscription>,
}

type DispatchProps = {
    getUserData: () => void,
    getMyProducts: () => void,
    getMyPurchases: () => void,
    redirectToEditProduct: (id: ProductId) => void,
    redirectToPublishProduct: (id: ProductId) => void,
}

type OwnProps = {
    tab: AccountPageTab, // Given in router
}

type RouterProps = {
    match: {
        params: {
            tab: AccountPageTab
        }
    }
}

type Props = StateProps & DispatchProps & OwnProps & RouterProps

class AccountPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        const { isFetchingMyProducts, isFetchingMyPurchases, match: { params: { tab: currentTab } } } = this.props

        this.props.getUserData()
        if (currentTab === 'products' && !isFetchingMyProducts) {
            this.props.getMyProducts()
        }
        if (currentTab === 'purchases' && !isFetchingMyPurchases) {
            this.props.getMyPurchases()
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { isFetchingMyProducts, isFetchingMyPurchases, match: { params: { tab: currentTab } } } = this.props

        if (currentTab !== prevProps.match.params.tab) {
            this.props.getUserData()
            if (currentTab === 'products' && !isFetchingMyProducts) {
                this.props.getMyProducts()
            }
            if (currentTab === 'purchases' && !isFetchingMyPurchases) {
                this.props.getMyPurchases()
            }
        }
    }

    render() {
        const {
            myProducts,
            isFetchingMyProducts,
            myPurchases,
            isFetchingMyPurchases,
            user,
            redirectToEditProduct,
            redirectToPublishProduct,
            subscriptions,
            match: { params: { tab } },
        } = this.props

        const products = tab === 'products' ? myProducts : myPurchases
        const isFetchingProducts = tab === 'products' ? isFetchingMyProducts : isFetchingMyPurchases

        return (
            <AccountPageComponent
                user={user}
                tab={tab}
                products={products}
                isFetchingProducts={isFetchingProducts}
                redirectToEditProduct={redirectToEditProduct}
                redirectToPublishProduct={redirectToPublishProduct}
                subscriptions={subscriptions}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    user: selectUserData(state),
    myProducts: selectMyProductList(state),
    isFetchingMyProducts: selectFetchingMyProductList(state),
    myPurchases: selectMyPurchaseList(state),
    isFetchingMyPurchases: selectFetchingMyPurchaseList(state),
    subscriptions: selectSubscriptions(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getUserData: () => dispatch(getUserData()),
    getMyProducts: () => dispatch(getMyProducts),
    getMyPurchases: () => dispatch(getMyPurchases),
    redirectToEditProduct: (id: ProductId) => dispatch(push(formatPath(links.products, id, 'edit'))),
    redirectToPublishProduct: (id: ProductId) => dispatch(push(formatPath(links.products, id, 'publish'))),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)
