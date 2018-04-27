// @flow

import React from 'react'
import { connect } from 'react-redux'

import { getUserData } from '../../modules/user/actions'
import AccountPageComponent from '../../components/AccountPage'
import type { User } from '../../flowtype/user-types'
import { selectUserData } from '../../modules/user/selectors'
import type { StoreState } from '../../flowtype/store-state'

import type { ProductList } from '../../flowtype/product-types'
import { getMyProducts } from '../../modules/myProductList/actions'
import { getMyPurchases } from '../../modules/myPurchaseList/actions'

import { selectMyProductList, selectFetchingMyProductList } from '../../modules/myProductList/selectors'
import { selectMyPurchaseList, selectFetchingMyPurchaseList } from '../../modules/myPurchaseList/selectors'

export type AccountPageTab = 'purchases' | 'products'

type StateProps = {
    user: ?User,
    myProducts: ProductList,
    isFetchingMyProducts: boolean,
    myPurchases: ProductList,
    isFetchingMyPurchases: boolean,
}

type DispatchProps = {
    getUserData: () => void,
    getMyProducts: () => void,
    getMyPurchases: () => void,
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
    componentWillMount() {
        this.props.getUserData()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.tab === 'products') {
            if (!(nextProps.isFetchingMyProducts || this.props.isFetchingMyProducts)) {
                this.props.getMyProducts()
            }
        }
        if (nextProps.match.params.tab === 'purchases') {
            if (!(nextProps.isFetchingMyPurchases || this.props.isFetchingMyPurchases)) {
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
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getUserData: () => dispatch(getUserData()),
    getMyProducts: () => dispatch(getMyProducts),
    getMyPurchases: () => dispatch(getMyPurchases),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)
