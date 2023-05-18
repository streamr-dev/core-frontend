import React from 'react'
import { Provider } from 'react-redux'
import {MemoryRouter} from 'react-router-dom'
import {render, RenderResult, screen} from '@testing-library/react'
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

jest.mock('$app/src/modals/ConnectModal', () => ({
    __esModule: true,
    default: () => <></>,
}))

jest.mock('$routes', () => ({
    __esModule: true,
    default: {
        root: jest.fn(),
        projects: {
            index: jest.fn()
        },
        streams: {
            index: jest.fn()
        },
        networkExplorer: jest.fn()
    },
}))

function mountNav(): RenderResult {
    return render(
        <MemoryRouter>
            <Provider store={mockStore({})}>
                <Nav />
            </Provider>
        </MemoryRouter>
    )
}

/* eslint-disable object-curly-newline */
describe('Nav.Wide', () => {

    it('renders logo', () => {
        mountNav()
        expect(screen.getByTestId('logo')).toBeTruthy()
    })

    it('renders the menu links', () => {
        mountNav()
        expect(screen.getAllByText('Streams').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Projects').length).toBeGreaterThan(0)
    })

    it('renders the Connect button', () => {
        mountNav()
        expect(screen.getAllByText('Connect').length).toBeGreaterThan(0)
    })

    describe('When the user is signed in', () => {
        beforeEach(() => {
            (useWalletAccount as any).mockImplementation(() => '0xADDR');
            (useEns as any).mockImplementation(() => '')
        })

        it('does not render the Connect button', () => {
            mountNav()
            expect(screen.queryAllByText('Connect').length).toEqual(0)
        })

        it('renders the Disconnect button', () => {
            mountNav()
            expect(screen.getAllByText('Disconnect').length).toBeGreaterThan(0)
        })

        it('renders the user avatar', () => {
            mountNav()
            expect(screen.queryByTestId('avatarless')).toBeTruthy()
        })
    })
})
