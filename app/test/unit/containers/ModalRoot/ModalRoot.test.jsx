import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import { ModalRoot, mapStateToProps, mapDispatchToProps } from '../../../../src/marketplace/containers/ModalRoot'
import * as modalActions from '../../../../src/marketplace/modules/modals/actions'
import * as modals from '../../../../src/marketplace/utils/modals'

describe('ModalRoot', () => {
    let wrapper
    let props
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        props = {
            modalName: null,
            onClose: sandbox.stub().callsFake(() => {}),
            modalProps: {
                a: 'a',
                b: 'b',
                c: 'c',
            },
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders the component', () => {
        wrapper = shallow(<ModalRoot {...props} />)
        expect(wrapper.length).toEqual(1)
    })

    it('maps state to props', () => {
        const modalName = 'testModal'
        const modalProps = {
            a: 'a',
            b: 'b',
            c: 'c',
        }
        const state = {
            modals: {
                modalName,
                modalProps,
            },
        }
        const expectedProps = {
            modalName,
            modalProps,
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const hideModalStub = sandbox.stub(modalActions, 'hideModal').callsFake(() => 'hideModal')

        const actions = mapDispatchToProps(dispatchStub)
        const result = {
            onClose: actions.onClose(),
        }
        const expectedResult = {
            onClose: 'hideModal',
        }

        assert.deepStrictEqual(result, expectedResult)
        expect(dispatchStub.callCount).toEqual(Object.keys(expectedResult).length)
        expect(hideModalStub.calledOnce).toEqual(true)
    })

    it('renders null when no modal is set', () => {
        wrapper = shallow(<ModalRoot {...props} />)
        expect(wrapper.html()).toEqual(null)
    })

    it('renders the modal components', () => {
        const modalNames = [
            modals.SET_PRICE,
            modals.PURCHASE,
            modals.PUBLISH,
            modals.CONFIRM_NO_COVER_IMAGE,
            modals.STREAM_LIVE_DATA,
            modals.SAVE_PRODUCT,
        ]

        modalNames.forEach((modalName) => {
            const nextProps = {
                ...props,
                modalName,
            }

            wrapper = shallow(<ModalRoot {...nextProps} />)
            const modalComponent = wrapper.find(modals.default[modalName])

            expect(modalComponent.length).toEqual(1)
            expect(modalComponent.prop('a')).toEqual(props.modalProps.a)
            expect(modalComponent.prop('b')).toEqual(props.modalProps.b)
            expect(modalComponent.prop('c')).toEqual(props.modalProps.c)
        })
    })
})
