import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'
import { replace } from 'connected-react-router'

import {
    UnpublishDialog,
    mapStateToProps,
    mapDispatchToProps,
} from '$mp/containers/deprecated/ProductPage/PublishOrUnpublishDialog/UnpublishDialog'
import { publishFlowSteps } from '$mp/utils/constants'
import ReadyToUnpublishDialog from '$mp/components/Modal/ReadyToUnpublishDialog'
import CompleteUnpublishDialog from '$mp/components/Modal/CompleteUnpublishDialog'
import CompleteContractProductUnpublishDialog from '$mp/components/Modal/CompleteContractProductUnpublishDialog'
import * as publishDialogSelectors from '$mp/modules/deprecated/publishDialog/selectors'
import * as publishDialogActions from '$mp/modules/deprecated/publishDialog/actions'
import * as unpublishSelectors from '$mp/modules/unpublish/selectors'
import * as urlUtils from '$shared/utils/url'
import links from '$shared/../links'

describe('UnpublishDialog', () => {
    let wrapper
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders correctly in CONFIRM state', () => {
        const props = {
            step: publishFlowSteps.CONFIRM,
        }

        wrapper = shallow(<UnpublishDialog {...props} />)
        expect(wrapper.find(ReadyToUnpublishDialog).length).toEqual(1)
    })

    it('renders correctly in UNPUBLISH_CONTRACT_PRODUCT state', () => {
        const props = {
            step: publishFlowSteps.UNPUBLISH_CONTRACT_PRODUCT,
        }

        wrapper = shallow(<UnpublishDialog {...props} />)
        expect(wrapper.find(CompleteContractProductUnpublishDialog).length).toEqual(1)
    })

    it('renders correctly in UNPUBLISH_FREE_PRODUCT state', () => {
        const props = {
            step: publishFlowSteps.UNPUBLISH_FREE_PRODUCT,
        }

        wrapper = shallow(<UnpublishDialog {...props} />)
        expect(wrapper.find(CompleteUnpublishDialog).length).toEqual(1)
    })

    it('maps state to props', () => {
        const selectStepStub = sandbox.stub(publishDialogSelectors, 'selectStep').callsFake(() => 'selectStep')
        const selectTransactionStub = sandbox.stub(unpublishSelectors, 'selectContractTransaction')
            .callsFake(() => 'selectUnpublishContractTransaction')
        const selectTransactionErrorStub = sandbox.stub(unpublishSelectors, 'selectContractError')
            .callsFake(() => 'unpublishContractProductError')
        const selectFreeProductStateStub = sandbox.stub(unpublishSelectors, 'selectFreeProductState')
            .callsFake(() => 'unpublishFreeProductState')

        const state = {}
        const expectedProps = {
            step: 'selectStep',
            unpublishContractProductTransaction: 'selectUnpublishContractTransaction',
            unpublishContractProductError: 'unpublishContractProductError',
            unpublishFreeProductState: 'unpublishFreeProductState',
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
        expect(selectStepStub.calledWith(state)).toEqual(true)
        expect(selectTransactionStub.calledWith(state)).toEqual(true)
        expect(selectTransactionErrorStub.calledWith(state)).toEqual(true)
        expect(selectFreeProductStateStub.calledWith(state)).toEqual(true)
    })

    it('maps actions to props', () => {
        sandbox.stub(publishDialogActions, 'unpublishProduct').callsFake(() => 'unpublishProduct')
        const formatPathStub = sandbox.stub(urlUtils, 'formatPath').callsFake((root, id) => `${root}/${id}`)

        const ownProps = {
            productId: 'prod-1',
        }
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const actions = mapDispatchToProps(dispatchStub, ownProps)

        actions.onUnpublish()
        actions.onCancel()

        expect(dispatchStub.callCount).toEqual(2)
        expect(dispatchStub.calledWith('unpublishProduct')).toEqual(true)
        expect(dispatchStub.calledWith(replace(`${links.marketplace.products}/prod-1`))).toEqual(true)
        expect(formatPathStub.calledWith(links.marketplace.products, 'prod-1')).toEqual(true)
    })
})
