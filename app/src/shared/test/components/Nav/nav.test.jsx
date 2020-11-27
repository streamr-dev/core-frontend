import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import mockStore from '$testUtils/mockStoreProvider'
import Nav from '$shared/components/Layout/Nav'

/* eslint-disable react/prop-types */
jest.mock('$shared/components/Link', () => {
    const Link = ({ to, href, children }) => (
        <div id={href || to}>{children}</div>
    )

    Link.Raw = Link

    return {
        __esModule: true,
        default: Link,
    }
})

jest.mock('$shared/components/Layout/User', () => {
    const User = ({ source }) => (
        <div id="User">
            {(source || {}).username}
        </div>
    )

    User.Avatarless = User

    const Username = ({ source }) => (
        <div id="Username">
            {(source || {}).username}
        </div>
    )

    User.Avatarless = User
    User.UsernameCopy = Username

    return {
        __esModule: true,
        default: User,
    }
})

/* eslint-disable object-curly-newline */
describe('Nav.Wide', () => {
    it('renders logo', () => {
        const store = {
            user: {},
        }
        const el = mount((
            <MemoryRouter>
                <Provider store={mockStore(store)}>
                    <Nav.Wide />
                </Provider>
            </MemoryRouter>
        ))

        expect(el.find('LogoItem').exists()).toBe(true)
    })

    describe('When the user is not signed in', () => {
        it('renders the menu links', () => {
            const store = {
                user: {},
            }
            const el = mount((
                <MemoryRouter>
                    <Provider store={mockStore(store)}>
                        <Nav.Wide />
                    </Provider>
                </MemoryRouter>
            ))

            expect(el.find({ id: '/core/streams' }).exists()).toBe(true)
            expect(el.find({ id: '/marketplace' }).exists()).toBe(true)
            expect(el.find({ id: '/docs/getting-started' }).exists()).toBe(true)
            expect(el.find({ id: '/login' }).exists()).toBe(true)
            expect(el.find({ id: '/signup' }).exists()).toBe(true)
        })
    })

    describe('When the user is signed in', () => {
        it('renders the menu links', () => {
            const store = {
                user: {
                    user: {
                        id: '1',
                        username: 'tester1@streamr.com',
                    },
                },
            }
            const el = mount((
                <MemoryRouter>
                    <Provider store={mockStore(store)}>
                        <Nav.Wide />
                    </Provider>
                </MemoryRouter>
            ))

            expect(el.find({ id: '/core/streams' }).exists()).toBe(true)
            expect(el.find({ id: '/marketplace' }).exists()).toBe(true)
            expect(el.find({ id: '/docs/getting-started' }).exists()).toBe(true)
            expect(el.find({ id: '/login' }).exists()).toBe(false)
            expect(el.find({ id: '/signup' }).exists()).toBe(false)
            expect(el.find({ id: '/logout' }).exists()).toBe(true)
        })

        it('renders the user avatar', () => {
            const store = {
                user: {
                    user: {
                        id: '1',
                        username: 'tester1@streamr.com',
                    },
                },
            }
            const el = mount((
                <MemoryRouter>
                    <Provider store={mockStore(store)}>
                        <Nav.Wide />
                    </Provider>
                </MemoryRouter>
            ))

            expect(el.find({ id: 'User' }).exists()).toBe(true)
            expect(el.find({ id: 'User' }).text()).toMatch(/tester1@streamr\.com/)
        })
    })
})

/* eslint-enable object-curly-newline */
