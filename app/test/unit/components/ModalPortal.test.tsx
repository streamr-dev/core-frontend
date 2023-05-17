/* eslint-disable react/prop-types */
import React from 'react'
import { render } from '@testing-library/react'
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
        const result = render(<ModalPortalProvider><></></ModalPortalProvider>)
        expect(result.container.querySelectorAll('#app')).toHaveLength(1)
        result.unmount()
    })
    it('renders children', () => {
        const result = render(
            <ModalPortalProvider>
                <div className="child" />
                <div className="child" />
            </ModalPortalProvider>,
        )
        expect(result.container.querySelectorAll('#app .child')).toHaveLength(2)
    })
    it('provides current modal root to context consumers', () => {
        const consume = jest.fn()
        expect(
            render(
                <ModalPortalProvider>
                    <ModalPortalContext.Consumer>{consume}</ModalPortalContext.Consumer>
                </ModalPortalProvider>,
            ),
        )
        expect(consume.mock.calls[0][0].isModalOpen).toBe(false)
        expect(consume.mock.calls[0][0].registerModal).toBeInstanceOf(Function)
        expect(consume.mock.calls[0][0].unregisterModal).toBeInstanceOf(Function)
    })
    it('provides a flag indicating that a modal is open', () => {
        const consume = jest.fn()
        const result = render(
            <ModalPortalProvider>
                <React.Fragment>
                    <ModalPortal><p data-testid={'modal-portal-content'}>Foo</p></ModalPortal>
                    <ModalPortal><p data-testid={'modal-portal-content'}>Foo</p></ModalPortal>
                    <ModalPortalContext.Consumer>{consume}</ModalPortalContext.Consumer>
                </React.Fragment>
            </ModalPortalProvider>,
        )
        expect(result.getAllByTestId('modal-portal-content').length).toEqual(2)
        expect(consume).toHaveBeenCalledTimes(2)
        expect(consume.mock.calls[0][0].isModalOpen).toBe(false)
        expect(consume.mock.calls[1][0].isModalOpen).toBe(true)
    })
    it('resets the flag indicating that the modal is open when modals are gone', () => {
        const consume = jest.fn()
        const result = render(
            <ModalPortalProvider>
                <React.Fragment>
                    <ModalPortal><p data-testid={'modal-portal-content'}>boom</p></ModalPortal>
                    <ModalPortalContext.Consumer>{consume}</ModalPortalContext.Consumer>
                </React.Fragment>
            </ModalPortalProvider>,
        )
        expect(result.getAllByTestId('modal-portal-content').length).toEqual(1)
        expect(consume).toHaveBeenCalledTimes(2)
        expect(consume.mock.calls[0][0].isModalOpen).toBe(false)
        expect(consume.mock.calls[1][0].isModalOpen).toBe(true)
        result.rerender(<ModalPortalProvider>
            <React.Fragment>
                <ModalPortalContext.Consumer>{consume}</ModalPortalContext.Consumer>
            </React.Fragment>
        </ModalPortalProvider>,)
        expect(result.queryAllByTestId('modal-portal-content').length).toEqual(0)
        expect(consume).toHaveBeenCalledTimes(4)
        // Before being unmounted…
        expect(consume.mock.calls[2][0].isModalOpen).toBe(true)
        // After being unmounted…
        expect(consume.mock.calls[3][0].isModalOpen).toBe(false)
    })
})
