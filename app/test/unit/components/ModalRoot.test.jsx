/* eslint-disable react/prop-types */

import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

import Context from '$shared/contexts/Modal'
import Modal from '$shared/components/Modal'
import ModalRoot from '$shared/components/ModalRoot'

describe(ModalRoot, () => {
    const { body } = global.document
    const modalRoot = global.document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')

    beforeEach(() => {
        if (body.contains(modalRoot)) {
            throw new Error('#modal-root already exisits.')
        }
        body.appendChild(modalRoot)
    })

    afterEach(() => {
        body.removeChild(modalRoot)
    })

    it('renders #app', () => {
        expect(shallow(<ModalRoot />).find('#app')).toHaveLength(1)
    })

    it('renders children', () => {
        const el = mount((
            <ModalRoot>
                <div className="child" />
                <div className="child" />
            </ModalRoot>
        ))
        expect(el.find('#app .child')).toHaveLength(2)
    })

    it('provides current modal root to context consumers', () => {
        const consume = sinon.spy()
        expect(mount((
            <ModalRoot>
                <Context.Consumer>
                    {consume}
                </Context.Consumer>
            </ModalRoot>
        )))
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('isModalOpen', false))
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('registerModal', sinon.match.instanceOf(Function)))
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('unregisterModal', sinon.match.instanceOf(Function)))
    })

    it('provides a flag indicating that a modal is open', () => {
        const consume = sinon.spy()
        const el = mount((
            <ModalRoot>
                <React.Fragment>
                    <Modal />
                    <Modal />
                    <Context.Consumer>
                        {consume}
                    </Context.Consumer>
                </React.Fragment>
            </ModalRoot>
        ))
        expect(el.instance().count).toEqual(2)
        sinon.assert.calledTwice(consume)
        sinon.assert.calledWith(consume.firstCall, sinon.match.has('isModalOpen', false))
        sinon.assert.calledWith(consume.secondCall, sinon.match.has('isModalOpen', true))
    })

    it('resets the flag indicating that the modal is open when modals are gone', () => {
        const consume = sinon.spy()
        const el = mount((
            <ModalRoot>
                <React.Fragment>
                    <Modal />
                    <Context.Consumer>
                        {consume}
                    </Context.Consumer>
                </React.Fragment>
            </ModalRoot>
        ))
        expect(el.instance().count).toEqual(1)
        sinon.assert.calledTwice(consume)
        sinon.assert.calledWith(consume.firstCall, sinon.match.has('isModalOpen', false))
        sinon.assert.calledWith(consume.lastCall, sinon.match.has('isModalOpen', true))
        el.setProps({
            children: (
                <React.Fragment>
                    <Context.Consumer>
                        {consume}
                    </Context.Consumer>
                </React.Fragment>
            ),
        })
        expect(el.instance().count).toEqual(0)
        sinon.assert.callCount(consume, 4)
        // Before being unmounted…
        sinon.assert.calledWith(consume.thirdCall, sinon.match.has('isModalOpen', true))
        // After being unmounted…
        sinon.assert.calledWith(consume.lastCall, sinon.match.has('isModalOpen', false))
    })
})
