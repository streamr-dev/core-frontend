import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import { PublishDialog, mapStateToProps, mapDispatchToProps } from '$mp/containers/deprecated/ProductPage/PublishOrUnpublishDialog/PublishDialog'
import * as urlUtils from '$shared/utils/url'
import * as publishDialogActions from '$mp/modules/deprecated/publishDialog/actions'
import { publishFlowSteps } from '$mp/utils/constants'
import { transactionStates, productStates } from '$shared/utils/constants'
import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import CompletePublishDialog from '$mp/components/deprecated/CompletePublishDialog'
import CompleteContractProductPublishDialog from '$mp/components/deprecated/CompleteContractProductPublishDialog'
import NoStreamsWarningDialog from '$mp/components/deprecated/NoStreamsWarningDialog'
import links from '$shared/../links'

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
        const publishTransaction = {
            id: '1',
            type: 'publish',
            state: transactionStates.PENDING,
        }
        const publishError = {
            message: 'publishError',
        }
        const createContractProductTransaction = {
            id: '2',
            type: 'createContractProduct',
            state: transactionStates.STARTED,
        }
        const createContractProductError = {
            message: 'createContractProductError',
        }
        const state = {
            publishDialog: {
                productId: product.id,
                step: publishFlowSteps.CONFIRM,
            },
            createContractProduct: {
                modifyTx: '2',
                error: createContractProductError,
            },
            product: {
                fetchingProduct: true,
            },
            publish: {
                contractTx: '1',
                contractError: publishError,
                freeProductState: transactionStates.CONFIRMED,
            },
            contractProduct: {
                fetchingContractProduct: true,
            },
            entities: {
                transactions: {
                    '1': publishTransaction,
                    '2': createContractProductTransaction,
                },
            },
        }
        const expectedProps = {
            step: publishFlowSteps.CONFIRM,
            publishContractProductTransaction: publishTransaction,
            publishContractProductError: publishError,
            createContractProductTransaction,
            createContractProductError,
            publishFreeProductState: transactionStates.CONFIRMED,
            fetchingContractProduct: true,
            fetchingProduct: true,
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
        expect(formatPathStub.calledWith(links.marketplace.products, product.id)).toEqual(true)
    })

    it('renders null when no step is set', () => {
        wrapper = shallow(<PublishDialog {...props} />)
        expect(wrapper.length).toEqual(1)
        expect(wrapper.getElement()).toEqual(null)
    })

    it('renders the confirm step correctly when fetching product', () => {
        const nextProps = {
            ...props,
            step: publishFlowSteps.CONFIRM,
            fetchingProduct: true,
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(ReadyToPublishDialog).length).toEqual(1)
        expect(wrapper.find(ReadyToPublishDialog).prop('waiting')).toEqual(true)
    })

    it('renders the confirm step correctly when fetching contract product', () => {
        const nextProps = {
            ...props,
            step: publishFlowSteps.CONFIRM,
            fetchingProduct: false,
            fetchingContractProduct: true,
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(ReadyToPublishDialog).length).toEqual(1)
        expect(wrapper.find(ReadyToPublishDialog).prop('waiting')).toEqual(true)
    })

    it('renders the confirm step correctly when product has no streams', () => {
        const nextProps = {
            ...props,
            step: publishFlowSteps.CONFIRM,
            fetchingProduct: false,
            fetchingContractProduct: false,
            product: {
                streams: [],
            },
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(NoStreamsWarningDialog).length).toEqual(1)
    })

    it('renders the confirm step correctly when product has streams', () => {
        const nextProps = {
            ...props,
            step: publishFlowSteps.CONFIRM,
            fetchingProduct: false,
            fetchingContractProduct: false,
            product: {
                streams: [1, 2],
            },
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(ReadyToPublishDialog).length).toEqual(1)
    })

    it('renders the CREATE_CONTRACT_PRODUCT step correctly', () => {
        const transaction = {
            state: transactionStates.CONFIRMED,
        }
        const nextProps = {
            ...props,
            step: publishFlowSteps.CREATE_CONTRACT_PRODUCT,
            createContractProductTransaction: transaction,
            createContractProductError: null,
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(CompleteContractProductPublishDialog).length).toEqual(1)
        expect(wrapper.find(CompleteContractProductPublishDialog).prop('publishState'))
            .toEqual(transaction.state)
    })

    it('renders the PUBLISH_CONTRACT_PRODUCT step correctly', () => {
        const transaction = {
            state: transactionStates.CONFIRMED,
        }
        const nextProps = {
            ...props,
            step: publishFlowSteps.PUBLISH_CONTRACT_PRODUCT,
            publishContractProductTransaction: transaction,
            publishContractProductError: null,
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(CompleteContractProductPublishDialog).length).toEqual(1)
        expect(wrapper.find(CompleteContractProductPublishDialog).prop('publishState'))
            .toEqual(transaction.state)
    })

    it('renders the PUBLISH_FREE_PRODUCT step correctly', () => {
        const nextProps = {
            ...props,
            step: publishFlowSteps.PUBLISH_FREE_PRODUCT,
            publishFreeProductState: transactionStates.CONFIRMED,
        }

        wrapper = shallow(<PublishDialog {...nextProps} />)
        expect(wrapper.find(CompletePublishDialog).length).toEqual(1)
        expect(wrapper.find(CompletePublishDialog).prop('publishState'))
            .toEqual(nextProps.publishFreeProductState)
    })
})
