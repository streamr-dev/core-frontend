import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'
import { replace } from 'react-router-redux'

import {
    UnpublishDialog,
    mapStateToProps,
    mapDispatchToProps,
} from '../../../../../src/containers/ProductPage/PublishOrUnpublishDialog/UnpublishDialog'
import { publishFlowSteps } from '../../../../../src/utils/constants'
import ReadyToUnpublishDialog from '../../../../../src/components/Modal/ReadyToUnpublishDialog'
import CompleteUnpublishDialog from '../../../../../src/components/Modal/CompleteUnpublishDialog'
import * as publishDialogSelectors from '../../../../../src/modules/publishDialog/selectors'
import * as publishDialogActions from '../../../../../src/modules/publishDialog/actions'
import * as publishSelectors from '../../../../../src/modules/publish/selectors'
import * as urlUtils from '../../../../../src/utils/url'

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

    it('renders correctly in PUBLISH state', () => {
        const props = {
            step: publishFlowSteps.PUBLISH,
        }

        wrapper = shallow(<UnpublishDialog {...props} />)
        expect(wrapper.find(CompleteUnpublishDialog).length).toEqual(1)
    })

    it('maps state to props', () => {
        const selectStepStub = sandbox.stub(publishDialogSelectors, 'selectStep').callsFake(() => 'selectStep')
        const selectTxStateStub = sandbox.stub(publishSelectors, 'selectTransactionState').callsFake(() => 'selectTransactionState')

        const state = {}
        const expectedProps = {
            step: 'selectStep',
            transactionState: 'selectTransactionState',
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
        expect(selectStepStub.calledWith(state)).toEqual(true)
        expect(selectTxStateStub.calledWith(state)).toEqual(true)
    })

    it('maps actions to props', () => {
        sandbox.stub(publishDialogActions, 'unpublishProduct').callsFake(() => 'unpublishProduct')
        const formatPathStub = sandbox.stub(urlUtils, 'formatPath').callsFake((root, id) => `${root}/${id}`)

        const ownProps = {
            redirectOnCancel: true,
            productId: 'prod-1',
        }
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const actions = mapDispatchToProps(dispatchStub, ownProps)

        actions.onUnpublish()
        actions.onCancel()

        expect(dispatchStub.callCount).toEqual(2)
        expect(dispatchStub.calledWith('unpublishProduct')).toEqual(true)
        expect(dispatchStub.calledWith(replace('/products/prod-1'))).toEqual(true)
        expect(formatPathStub.calledWith('/products', 'prod-1')).toEqual(true)
    })

    it('should not redirect when redirectOnCancel is false', () => {
        const ownProps = {
            redirectOnCancel: false,
            productId: 'prod-1',
        }
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const actions = mapDispatchToProps(dispatchStub, ownProps)

        actions.onCancel()

        expect(dispatchStub.callCount).toEqual(0)
    })
})
