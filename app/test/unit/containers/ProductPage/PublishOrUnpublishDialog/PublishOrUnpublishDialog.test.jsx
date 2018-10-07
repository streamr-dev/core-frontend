import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'
import { replace } from 'react-router-redux'

import { PublishOrUnpublishDialog, mapStateToProps, mapDispatchToProps } from '$mp/containers/ProductPage/PublishOrUnpublishDialog'
import { productStates } from '$mp/utils/constants'
import UnpublishDialog from '$mp/containers/ProductPage/PublishOrUnpublishDialog/UnpublishDialog'
import PublishDialog from '$mp/containers/ProductPage/PublishOrUnpublishDialog/PublishDialog'

import * as publishDialogActions from '$mp/modules/publishDialog/actions'
import * as contractProductActions from '$mp/modules/contractProduct/actions'

describe('PublishOrUnpublishDialog', () => {
    let wrapper
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders correctly in DEPLOYED state', () => {
        const props = {
            product: {
                state: productStates.DEPLOYED,
            },
            initPublish: () => {},
        }

        wrapper = shallow(<PublishOrUnpublishDialog {...props} />)
        expect(wrapper.find(UnpublishDialog).length).toEqual(1)
    })

    it('renders correctly in other states', () => {
        const props = {
            product: {
                state: productStates.DEPLOYING,
            },
            initPublish: () => {},
        }

        wrapper = shallow(<PublishOrUnpublishDialog {...props} />)
        expect(wrapper.find(PublishDialog).length).toEqual(1)
    })

    it('maps state to props', () => {
        const state = {}
        const expectedProps = {}
        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        sandbox.stub(contractProductActions, 'getProductFromContract').callsFake(() => 'getProductFromContract')
        sandbox.stub(publishDialogActions, 'initPublish').callsFake(() => 'initPublish')

        const ownProps = {
            redirectOnCancel: true,
            productId: 'product-1',
        }
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const actions = mapDispatchToProps(dispatchStub, ownProps)

        const result = {
            getProductFromContract: actions.getProductFromContract(ownProps.productId),
            initPublish: actions.initPublish(ownProps.productId),
            onCancel: actions.onCancel(),
            redirectBackToProduct: actions.redirectBackToProduct(ownProps.productId),
        }
        const expectedResult = {
            getProductFromContract: 'getProductFromContract',
            initPublish: 'initPublish',
            onCancel: replace('/products/product-1'),
            redirectBackToProduct: replace('/products/product-1'),
        }

        assert.deepStrictEqual(result, expectedResult)
        expect(dispatchStub.callCount).toEqual(Object.keys(expectedResult).length)
    })

    it('reacts to contract product state changes', () => {
        const props = {
            product: {
                state: productStates.DEPLOYED,
                pricePerSecond: '1000',
            },
            contractProduct: {
                state: productStates.DEPLOYED,
                pricePerSecond: '1000',
            },
            initPublish: () => {},
        }

        wrapper = shallow(<PublishOrUnpublishDialog {...props} />)
        expect(wrapper.state('startingState')).toEqual(productStates.DEPLOYED)

        wrapper.setProps({
            product: {
                state: productStates.NOT_DEPLOYED,
                pricePerSecond: '1000',
            },
            contractProduct: {
                state: productStates.NOT_DEPLOYED,
                pricePerSecond: '1000',
            },
        })
        expect(wrapper.state('startingState')).toEqual(productStates.NOT_DEPLOYED)
    })
})
