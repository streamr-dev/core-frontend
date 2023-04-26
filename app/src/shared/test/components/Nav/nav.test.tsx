import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { jest } from '@jest/globals'
import mockStore from '$app/test/test-utils/mockStoreProvider'
import Nav from '$shared/components/Layout/Nav'
import { useWalletAccount, useEns } from '$shared/stores/wallet'

jest.mock('$shared/components/AccountsBalance', () => ({
    __esModule: true,
    default: () => <></>,
}))

jest.mock('$shared/stores/wallet', () => ({
    __esModule: true,
    useWalletAccount: jest.fn(),
    useEns: jest.fn(),
}))

function mountNav() {
    return mount(
        <MemoryRouter>
            <Provider store={mockStore({})}>
                <Nav />
            </Provider>
        </MemoryRouter>,
    )
}

/* eslint-disable object-curly-newline */
describe('Nav.Wide', () => {
    beforeEach(() => {})

    it('renders logo', () => {
        expect(mountNav().find('Logo').exists()).toBe(true)
    })

    it('renders the menu links', () => {
        const el = mountNav()

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
    })

    it('renders the Connect button', () => {
        expect(
            mountNav()
                .find('button')
                .findWhere((node) => node.text() === 'Connect')
                .exists(),
        ).toBe(true)
    })

    describe.only('When the user is signed in', () => {
        beforeEach(() => {
            (useWalletAccount as any).mockImplementation(() => '0xADDR');
            (useEns as any).mockImplementation(() => '')
        })

        it('renders the menu links', () => {
            expect(
                mountNav()
                    .find({
                        href: '/hub/streams',
                    })
                    .exists(),
            ).toBe(true)
        })

        it('does not render the Connect button', () => {
            expect(
                mountNav()
                    .find('button')
                    .findWhere((node) => node.text() === 'Connect')
                    .exists(),
            ).toBe(false)
        })

        it('renders the Disconnect button', () => {
            expect(
                mountNav()
                    .find('button')
                    .findWhere((node) => node.text() === 'Disconnect')
                    .exists(),
            ).toBe(true)
        })

        it('renders the user avatar', () => {
            expect(mountNav().find('UnstyledAvatarImage').exists()).toBe(true)
        })
    })
})
