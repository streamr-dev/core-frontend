import React from 'react'
import {Provider} from "react-redux"
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import {jest} from "@jest/globals"
import mockStore from "$app/test/test-utils/mockStoreProvider"
import Nav from '$shared/components/Layout/Nav'
import {authenticationControllerStub} from "$auth/authenticationController.stub"
import {useAuthController} from "$auth/hooks/useAuthController"
import Mock = jest.Mock
jest.mock('$auth/hooks/useAuthController', () => {
    return {
        useAuthController: jest.fn()
    }
})
jest.mock('$userpages/components/Header/AccountsBalance', () => ({__esModule: true, default: () => <></>}))

/* eslint-disable object-curly-newline */
describe('Nav.Wide', () => {
    beforeEach(() => {
        (useAuthController as Mock).mockReturnValue(authenticationControllerStub)
    })
    it('renders logo', () => {
        const el = mount(
            <MemoryRouter>
                <Provider store={mockStore({})}>
                    <Nav />
                </Provider>
            </MemoryRouter>,
        )
        expect(el.find('Logo').exists()).toBe(true)
    })
    describe('When the user is not signed in', () => {
        beforeEach(() => {
            // simulate lack of stored user wallet address
            (useAuthController as Mock).mockReturnValueOnce({
                ...authenticationControllerStub, currentAuthSession: {address: undefined, method: undefined}
            })
        })
        it('renders the menu links', () => {
            const el = mount(
                <MemoryRouter>
                    <Provider store={mockStore({})}>
                        <Nav />
                    </Provider>
                </MemoryRouter>,
            )
            expect(
                el
                    .find({
                        href: '/hub/streams',
                    })
                    .exists(),
            ).toBe(true)
            expect(
                el
                    .find({
                        href: '/hub/projects',
                    })
                    .exists(),
            ).toBe(true)
            expect(
                el
                    .find({
                        href: '/hub/login?redirect=%2F',
                    })
                    .exists(),
            ).toBe(true)
        })
    })
    describe('When the user is signed in', () => {
        it('renders the menu links', () => {

            const el = mount(
                <MemoryRouter>
                    <Provider store={mockStore({})}>
                        <Nav />
                    </Provider>
                </MemoryRouter>,
            )
            expect(
                el
                    .find({
                        href: '/hub/streams',
                    })
                    .exists(),
            ).toBe(true)
            expect(
                el
                    .find({
                        href: '/hub/login',
                    })
                    .exists(),
            ).toBe(false)
            expect(
                el
                    .find({
                        href: '/hub/logout',
                    })
                    .exists(),
            ).toBe(true)
        })
        it('renders the user avatar', () => {
            const el = mount(
                <MemoryRouter>
                    <Provider store={mockStore({})}>
                        <Nav />
                    </Provider>
                </MemoryRouter>,
            )
            expect(el.find('UnstyledAvatarImage').exists()).toBe(true)
        })
    })
})
/* eslint-enable object-curly-newline */
