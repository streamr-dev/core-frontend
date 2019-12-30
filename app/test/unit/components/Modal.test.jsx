import React from 'react'
import { mount } from 'enzyme'

import ModalPortal from '$shared/components/ModalPortal'
import { Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'

describe('ModalPortal', () => {
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

    xit('mounts Modals inside #modal-root', () => {
        const root = mount(<ModalPortalProvider />)
        expect(modalRoot.hasChildNodes()).toBe(false)
        root.setProps({
            children: <ModalPortal>Modal content</ModalPortal>,
        })
        expect(modalRoot.hasChildNodes()).toBe(true)
        root.setProps({
            children: null,
        })
        expect(modalRoot.hasChildNodes()).toBe(false)
    })
})
