/* eslint-disable react/prop-types */

import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

import { Context as ModalPortalContext, Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'
import ModalPortal from '$shared/components/ModalPortal'

describe(ModalPortalProvider, () => {
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
        expect(shallow(<ModalPortalProvider />).find('#app')).toHaveLength(1)
    })

    it('renders children', () => {
        const el = mount((
            <ModalPortalProvider>
                <div className="child" />
                <div className="child" />
            </ModalPortalProvider>
        ))
        expect(el.find('#app .child')).toHaveLength(2)
    })

    it('provides current modal root to context consumers', () => {
        const consume = sinon.spy()
        expect(mount((
            <ModalPortalProvider>
                <ModalPortalContext.Consumer>
                    {consume}
                </ModalPortalContext.Consumer>
            </ModalPortalProvider>
        )))
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('isModalOpen', false))
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('registerModal', sinon.match.instanceOf(Function)))
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('unregisterModal', sinon.match.instanceOf(Function)))
    })

    xit('provides a flag indicating that a modal is open', () => {
        const consume = sinon.spy()
        const el = mount((
            <ModalPortalProvider>
                <React.Fragment>
                    <ModalPortal />
                    <ModalPortal />
                    <ModalPortalContext.Consumer>
                        {consume}
                    </ModalPortalContext.Consumer>
                </React.Fragment>
            </ModalPortalProvider>
        ))
        expect(el.instance().count).toEqual(2)
        sinon.assert.calledTwice(consume)
        sinon.assert.calledWith(consume.firstCall, sinon.match.has('isModalOpen', false))
        sinon.assert.calledWith(consume.secondCall, sinon.match.has('isModalOpen', true))
    })

    xit('resets the flag indicating that the modal is open when modals are gone', () => {
        const consume = sinon.spy()
        const el = mount((
            <ModalPortalProvider>
                <React.Fragment>
                    <ModalPortal />
                    <ModalPortalContext.Consumer>
                        {consume}
                    </ModalPortalContext.Consumer>
                </React.Fragment>
            </ModalPortalProvider>
        ))
        expect(el.instance().count).toEqual(1)
        sinon.assert.calledTwice(consume)
        sinon.assert.calledWith(consume.firstCall, sinon.match.has('isModalOpen', false))
        sinon.assert.calledWith(consume.lastCall, sinon.match.has('isModalOpen', true))
        el.setProps({
            children: (
                <React.Fragment>
                    <ModalPortalContext.Consumer>
                        {consume}
                    </ModalPortalContext.Consumer>
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
