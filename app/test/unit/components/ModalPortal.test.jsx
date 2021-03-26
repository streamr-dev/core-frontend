/* eslint-disable react/prop-types */

import React from 'react'
import { shallow, mount } from 'enzyme'

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
        jest.clearAllMocks()
        jest.restoreAllMocks()
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
        const consume = jest.fn()
        expect(mount((
            <ModalPortalProvider>
                <ModalPortalContext.Consumer>
                    {consume}
                </ModalPortalContext.Consumer>
            </ModalPortalProvider>
        )))
        expect(consume.mock.calls[0][0].isModalOpen).toBe(false)
        expect(consume.mock.calls[0][0].registerModal).toBeInstanceOf(Function)
        expect(consume.mock.calls[0][0].unregisterModal).toBeInstanceOf(Function)
    })

    it('provides a flag indicating that a modal is open', () => {
        const consume = jest.fn()
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
        expect(consume).toHaveBeenCalledTimes(2)
        expect(consume.mock.calls[0][0].isModalOpen).toBe(false)
        expect(consume.mock.calls[1][0].isModalOpen).toBe(true)
    })

    it('resets the flag indicating that the modal is open when modals are gone', () => {
        const consume = jest.fn()
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
        expect(consume).toHaveBeenCalledTimes(2)
        expect(consume.mock.calls[0][0].isModalOpen).toBe(false)
        expect(consume.mock.calls[1][0].isModalOpen).toBe(true)
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
        expect(consume).toHaveBeenCalledTimes(4)
        // Before being unmounted…
        expect(consume.mock.calls[2][0].isModalOpen).toBe(true)
        // After being unmounted…
        expect(consume.mock.calls[3][0].isModalOpen).toBe(false)
    })
})
