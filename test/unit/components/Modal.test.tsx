import React from 'react'
import { render } from '@testing-library/react'
import ModalPortal from '~/shared/components/ModalPortal'
import { Provider as ModalPortalProvider } from '~/shared/contexts/ModalPortal'
describe('ModalPortal', () => {
    const { body } = global.document
    const modalRoot = global.document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')
    beforeEach(() => {
        if (!body.contains(modalRoot)) {
            return void body.appendChild(modalRoot)
        }

        throw new Error('#modal-root already exisits.')
    })
    afterEach(() => {
        body.removeChild(modalRoot)
    })
    it('mounts Modals inside #modal-root', () => {
        render(
            <ModalPortalProvider>
                <ModalPortal>Modal content</ModalPortal>
            </ModalPortalProvider>,
        )
        expect(modalRoot.hasChildNodes()).toBe(true)
    })
})
