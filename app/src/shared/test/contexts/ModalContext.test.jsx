import React, { useContext } from 'react'
import { MemoryRouter, withRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import { Context as ModalContext, Provider as ModalContextProvider } from '$shared/contexts/ModalApi'

describe('ModalContext', () => {
    it('has no modals defined by default', () => {
        let currentContext
        function Test() {
            currentContext = useContext(ModalContext)
            return null
        }

        mount((
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>
        ))

        expect(currentContext.modals).toStrictEqual({})
    })

    it('opens the modal', async () => {
        let currentContext
        function Test() {
            currentContext = useContext(ModalContext)
            return null
        }

        mount((
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>
        ))

        await act(async () => {
            currentContext.openModal('myModal', 'modalValue')
        })

        expect(currentContext.modals).toMatchObject({
            myModal: {
                value: 'modalValue',
            },
        })
    })

    it('closes the modal and returns a value', async () => {
        let currentContext
        function Test() {
            currentContext = useContext(ModalContext)
            return null
        }

        mount((
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>
        ))

        const acceptFn = jest.fn()
        await act(async () => {
            currentContext.openModal('myModal', 'modalValue')
                .then(acceptFn)
        })

        expect(currentContext.modals).toMatchObject({
            myModal: {
                value: 'modalValue',
            },
        })

        await act(async () => {
            currentContext.closeModal('myModal', 'finalValue')
        })

        expect(currentContext.modals).toStrictEqual({})
        expect(acceptFn).toHaveBeenCalledWith('finalValue')
    })

    it('rejects the previous modal promise', async () => {
        let currentContext
        function Test() {
            currentContext = useContext(ModalContext)
            return null
        }

        mount((
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>
        ))

        const acceptFn = jest.fn()
        const rejectFn = jest.fn()
        await act(async () => {
            currentContext.openModal('myModal', 'modalValue')
                .then(acceptFn, rejectFn)
        })

        expect(currentContext.modals).toMatchObject({
            myModal: {
                value: 'modalValue',
            },
        })

        await act(async () => {
            currentContext.openModal('myModal', 'anotherValue')
        })

        expect(acceptFn).not.toHaveBeenCalled()
        expect(rejectFn).toHaveBeenCalled()
    })

    it('closes open modal on route change', async () => {
        let currentContext
        let history
        const Test = withRouter(({ history: routerHistory }) => {
            currentContext = useContext(ModalContext)
            history = routerHistory
            return null
        })

        mount((
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>
        ))

        const acceptFn = jest.fn()
        const rejectFn = jest.fn()
        await act(async () => {
            currentContext.openModal('myModal', 'modalValue')
                .then(acceptFn, rejectFn)
        })

        expect(currentContext.modals).toMatchObject({
            myModal: {
                value: 'modalValue',
            },
        })

        await act(async () => {
            history.push('/anotherPath')
        })

        expect(acceptFn).not.toHaveBeenCalled()
        expect(rejectFn).toHaveBeenCalled()
        expect(currentContext.modals).toStrictEqual({})
    })
})
