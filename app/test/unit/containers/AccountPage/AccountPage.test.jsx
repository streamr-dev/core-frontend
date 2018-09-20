import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'
import { push } from 'react-router-redux'

import { AccountPage, mapStateToProps, mapDispatchToProps } from '../../../../src/marketplace/containers/AccountPage'
import AccountPageComponent from '../../../../src/marketplace/components/AccountPage'
import * as urlUtils from '../../../../src/marketplace/utils/url'

import * as userSelectors from '../../../../src/marketplace/modules/user/selectors'
import * as myProductListSelectors from '../../../../src/marketplace/modules/myProductList/selectors'
import * as myPurchaseListSelectors from '../../../../src/marketplace/modules/myPurchaseList/selectors'
import * as userActions from '../../../../src/marketplace/modules/user/actions'
import * as myProductListActions from '../../../../src/marketplace/modules/myProductList/actions'
import * as myPurchaseListActions from '../../../../src/marketplace/modules/myPurchaseList/actions'

describe('AccountPage', () => {
    let wrapper
    let props
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        props = {
            match: {
                params: {
                    tab: 'purchases',
                },
            },
            children: null,
            myProducts: [],
            myPurchases: [],
            isFetchingMyProducts: false,
            isFetchingMyPurchases: false,
            getUserData: sandbox.spy(),
            getMyProducts: sandbox.spy(),
            getMyPurchases: sandbox.spy(),
            redirectToEditProduct: sandbox.spy(),
            redirectToPublishProduct: sandbox.spy(),
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders the component', () => {
        wrapper = shallow(<AccountPage {...props} />)
        expect(wrapper.find(AccountPageComponent).length).toEqual(1)
    })

    it('maps state to props', () => {
        sandbox.stub(userSelectors, 'selectUserData').callsFake(() => 'selectUserData')
        sandbox.stub(myProductListSelectors, 'selectMyProductList').callsFake(() => 'selectMyProductList')
        sandbox.stub(myProductListSelectors, 'selectFetchingMyProductList').callsFake(() => 'selectFetchingMyProductList')
        sandbox.stub(myPurchaseListSelectors, 'selectMyPurchaseList').callsFake(() => 'selectMyPurchaseList')
        sandbox.stub(myPurchaseListSelectors, 'selectFetchingMyPurchaseList').callsFake(() => 'selectFetchingMyPurchaseList')
        sandbox.stub(myPurchaseListSelectors, 'selectSubscriptions').callsFake(() => 'selectSubscriptions')

        const state = {}
        const expectedProps = {
            user: 'selectUserData',
            myProducts: 'selectMyProductList',
            isFetchingMyProducts: 'selectFetchingMyProductList',
            myPurchases: 'selectMyPurchaseList',
            isFetchingMyPurchases: 'selectFetchingMyPurchaseList',
            subscriptions: 'selectSubscriptions',
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        sandbox.stub(userActions, 'getUserData').callsFake(() => 'getUserData')
        sandbox.stub(myProductListActions, 'getMyProducts').callsFake(() => 'getMyProducts')
        sandbox.stub(myPurchaseListActions, 'getMyPurchases').callsFake(() => 'getMyPurchases')
        const formatPathStub = sandbox.stub(urlUtils, 'formatPath').callsFake((root, id, action) => `${root}/${id}/${action}`)

        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const actions = mapDispatchToProps(dispatchStub)

        const result = {
            getUserData: actions.getUserData(),
            getMyProducts: actions.getMyProducts(),
            getMyPurchases: actions.getMyPurchases(),
            redirectToEditProduct: actions.redirectToEditProduct('product-1'),
            redirectToPublishProduct: actions.redirectToPublishProduct('product-1'),
        }
        const expectedResult = {
            getUserData: 'getUserData',
            getMyProducts: 'getMyProducts',
            getMyPurchases: 'getMyPurchases',
            redirectToEditProduct: push('/products/product-1/edit'),
            redirectToPublishProduct: push('/products/product-1/publish'),
        }

        assert.deepStrictEqual(result, expectedResult)
        expect(dispatchStub.callCount).toEqual(Object.keys(expectedResult).length)
        expect(formatPathStub.calledWith('/products', 'product-1', 'edit')).toEqual(true)
        expect(formatPathStub.calledWith('/products', 'product-1', 'publish')).toEqual(true)
    })

    it('loads my purchases when created', () => {
        const newProps = {
            ...props,
            match: {
                params: {
                    tab: 'purchases',
                },
            },
        }

        wrapper = shallow(<AccountPage {...newProps} />)
        expect(props.getUserData.calledOnce).toEqual(true)
        expect(props.getMyProducts.calledOnce).toEqual(false)
        expect(props.getMyPurchases.calledOnce).toEqual(true)
    })

    it('loads my products when created', () => {
        const newProps = {
            ...props,
            match: {
                params: {
                    tab: 'products',
                },
            },
        }

        wrapper = shallow(<AccountPage {...newProps} />)
        expect(props.getUserData.calledOnce).toEqual(true)
        expect(props.getMyProducts.calledOnce).toEqual(true)
        expect(props.getMyPurchases.calledOnce).toEqual(false)
    })

    it('handles tab changes', () => {
        const newProps = {
            ...props,
            match: {
                params: {
                    tab: 'products',
                },
            },
        }

        wrapper = shallow(<AccountPage {...newProps} />)
        expect(props.getUserData.callCount).toEqual(1)
        expect(props.getMyProducts.callCount).toEqual(1)
        expect(props.getMyPurchases.callCount).toEqual(0)

        // Switch tab to purchases
        wrapper.setProps({
            match: {
                params: {
                    tab: 'purchases',
                },
            },
        })
        expect(props.getUserData.callCount).toEqual(2)
        expect(props.getMyProducts.callCount).toEqual(1)
        expect(props.getMyPurchases.callCount).toEqual(1)

        // Switch tab back to products
        wrapper.setProps({
            match: {
                params: {
                    tab: 'products',
                },
            },
        })
        expect(props.getUserData.callCount).toEqual(3)
        expect(props.getMyProducts.callCount).toEqual(2)
        expect(props.getMyPurchases.callCount).toEqual(1)
    })
})
