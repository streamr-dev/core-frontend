import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import {
    PublishDialog,
    mapStateToProps,
    mapDispatchToProps,
} from '../../../../src/marketplace/containers/ProductPage/PublishOrUnpublishDialog/PublishDialog'
import * as urlUtils from '../../../../src/marketplace/utils/url'
import * as publishDialogActions from '../../../../src/marketplace/modules/publishDialog/actions'
import { publishFlowSteps, transactionStates, productStates } from '../../../../src/marketplace/utils/constants'
import ReadyToPublishDialog from '../../../../src/marketplace/components/Modal/ReadyToPublishDialog'
import CompletePublishDialog from '../../../../src/marketplace/components/Modal/CompletePublishDialog'

describe('PublishDialog', () => {
    let wrapper
    let props
    let sandbox

    const product = {
        id: 'product-1',
        name: 'Product 1',
        state: productStates.NOT_DEPLOYED,
    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        props = {
            productId: product.id,
            redirectOnCancel: false,
            product,
            step: null,
            createProductTransactionState: null,
            publishTransactionState: null,
            fetchingContractProduct: false,
            onPublish: sandbox.spy(),
            onCancel: sandbox.spy(),
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('maps state to props', () => {
        const state = {
            publishDialog: {
                productId: product.id,
                step: publishFlowSteps.CONFIRM,
            },
            createContractProduct: {
                transactionState: transactionStates.CONFIRMED,
            },
            publish: {
                transactionState: transactionStates.PENDING,
            },
            contractProduct: {
                fetchingContractProduct: false,
            },
        }
        const expectedProps = {
            step: publishFlowSteps.CONFIRM,
            createProductTransactionState: transactionStates.CONFIRMED,
            publishTransactionState: transactionStates.PENDING,
            fetchingContractProduct: false,
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const publishOrCreateProductStub = sandbox.stub(publishDialogActions, 'publishOrCreateProduct')
        const formatPathStub = sandbox.stub(urlUtils, 'formatPath')
            .callsFake((root, id, action) => `${root}/${id}/${action}`)

        const actions = mapDispatchToProps(dispatchStub, props)

        actions.onPublish()
        actions.onCancel()

        expect(dispatchStub.callCount).toEqual(2)
        expect(publishOrCreateProductStub.calledOnce).toEqual(true)
        expect(formatPathStub.calledOnce).toEqual(true)
        expect(formatPathStub.calledWith('/products', product.id)).toEqual(true)
    })

    it('renders null when no step is set', () => {
        wrapper = shallow(<PublishDialog {...props} />)
        expect(wrapper.length).toEqual(1)
        expect(wrapper.getElement()).toEqual(null)
    })

    it('renders the confirm step correctly', () => {
        const nextProps = {
            ...props,
            step: publishFlowSteps.CONFIRM,
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(ReadyToPublishDialog).length).toEqual(1)
    })

    it('renders the create product step correctly', () => {
        const nextProps = {
            ...props,
            step: publishFlowSteps.CREATE_PRODUCT,
            createProductTransactionState: transactionStates.CONFIRMED,
            publishTransactionState: transactionStates.PENDING,
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(CompletePublishDialog).length).toEqual(1)
        expect(wrapper.find(CompletePublishDialog).prop('publishState'))
            .toEqual(nextProps.createProductTransactionState)
    })

    it('renders the publish correctly', () => {
        const nextProps = {
            ...props,
            step: publishFlowSteps.PUBLISH,
            createProductTransactionState: transactionStates.CONFIRMED,
            publishTransactionState: transactionStates.PENDING,
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(CompletePublishDialog).length).toEqual(1)
        expect(wrapper.find(CompletePublishDialog).prop('publishState'))
            .toEqual(nextProps.publishTransactionState)
    })
})
