import React, { useContext } from 'react'
import { MemoryRouter, NavigateFunction, useNavigate } from 'react-router-dom'
import { render, act } from '@testing-library/react'
import {
    Context as ModalContext,
    Provider as ModalContextProvider,
} from '~/shared/contexts/ModalApi'
describe('ModalContext', () => {
    it('has no modals defined by default', () => {
        let currentContext

        function Test() {
            currentContext = useContext(ModalContext)
            return null
        }

        render(
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>,
        )
        expect(currentContext.modals).toStrictEqual({})
    })
    it('opens the modal', async () => {
        let currentContext

        function Test() {
            currentContext = useContext(ModalContext)
            return null
        }

        render(
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>,
        )
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

        render(
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>,
        )
        const acceptFn = jest.fn()
        await act(async () => {
            currentContext.openModal('myModal', 'modalValue').then(acceptFn)
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

        render(
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>,
        )
        const acceptFn = jest.fn()
        const rejectFn = jest.fn()
        await act(async () => {
            currentContext.openModal('myModal', 'modalValue').then(acceptFn, rejectFn)
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

        let navigate: NavigateFunction | undefined

        function Test() {
            currentContext = useContext(ModalContext)
            navigate = useNavigate()
            return null
        }

        render(
            <MemoryRouter>
                <ModalContextProvider>
                    <Test />
                </ModalContextProvider>
            </MemoryRouter>,
        )
        const acceptFn = jest.fn()
        const rejectFn = jest.fn()
        await act(async () => {
            currentContext.openModal('myModal', 'modalValue').then(acceptFn, rejectFn)
        })
        expect(currentContext.modals).toMatchObject({
            myModal: {
                value: 'modalValue',
            },
        })
        await act(async () => {
            navigate!('/anotherPath')
        })
        expect(acceptFn).not.toHaveBeenCalled()
        expect(rejectFn).toHaveBeenCalled()
        expect(currentContext.modals).toStrictEqual({})
    })
})
