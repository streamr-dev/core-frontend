import React from 'react'
import { shallow, mount } from 'enzyme'

import Modal from '$shared/components/Modal'
import ModalRoot from '$shared/components/ModalRoot'
import NoModalRootError from '$shared/errors/NoModalRootError'

describe(Modal, () => {
    it('cannot be mounted w/o ModalRoot', () => {
        expect(() => {
            shallow(<Modal />)
        }).toThrow(NoModalRootError)
    })

    it('mounts inside #modal-root', () => {
        const el = mount((
            <ModalRoot>
                <div id="foo">
                    <span>Non-modal content</span>
                    <Modal>Modal content</Modal>
                </div>
            </ModalRoot>
        ))
        expect(el.text()).toMatch(/^non-modal content\s*modal content$/i)
        // Does #foo contain only non-modal stuff?
        expect(el.find('#foo').text()).toEqual('Non-modal content')
        // Is modal rendered inside #modal-root?
        expect(el.find('#modal-root').text()).toEqual('Modal content')
    })
})
