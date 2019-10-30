import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import { PublishOrUnpublishDialog, mapDispatchToProps } from '$mp/containers/deprecated/ProductPage/PublishOrUnpublishDialog'
import { productStates } from '$shared/utils/constants'
import UnpublishDialog from '$mp/containers/deprecated/ProductPage/PublishOrUnpublishDialog/UnpublishDialog'
import PublishDialog from '$mp/containers/deprecated/ProductPage/PublishOrUnpublishDialog/PublishDialog'

import * as publishDialogActions from '$mp/modules/deprecated/publishDialog/actions'

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
                streams: [1],
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
                streams: [1],
            },
            initPublish: () => {},
        }

        wrapper = shallow(<PublishOrUnpublishDialog {...props} />)
        expect(wrapper.find(PublishDialog).length).toEqual(1)
    })

    it('renders null if no product found', () => {
        const props = {
            product: null,
            fetchingProduct: false,
            initPublish: () => {},
        }

        wrapper = shallow(<PublishOrUnpublishDialog {...props} />)
        expect(wrapper.html()).toEqual(null)
    })

    it('maps actions to props', () => {
        sandbox.stub(publishDialogActions, 'initPublish').callsFake(() => 'initPublish')

        const ownProps = {
            productId: 'product-1',
        }
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const actions = mapDispatchToProps(dispatchStub, ownProps)

        const result = {
            initPublish: actions.initPublish(ownProps.productId),
        }
        const expectedResult = {
            initPublish: 'initPublish',
        }

        assert.deepStrictEqual(result, expectedResult)
        expect(dispatchStub.callCount).toEqual(Object.keys(expectedResult).length)
    })

    it('reacts to contract product state changes', () => {
        const props = {
            product: {
                state: productStates.DEPLOYED,
                pricePerSecond: '1000',
                streams: [1],
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
                streams: [1],
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
