import React from 'react'
import { mount } from 'enzyme'

import Modal from '$shared/components/Modal'
import ModalRoot from '$shared/components/ModalRoot'

describe(Modal, () => {
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

    it('mounts Modals inside #modal-root', () => {
        const root = mount(<ModalRoot />)
        expect(modalRoot.hasChildNodes()).toBe(false)
        root.setProps({
            children: <Modal>Modal content</Modal>,
        })
        expect(modalRoot.hasChildNodes()).toBe(true)
        root.setProps({
            children: null,
        })
        expect(modalRoot.hasChildNodes()).toBe(false)
    })
})
