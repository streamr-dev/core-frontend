import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import mockStore from '$testUtils/mockStoreProvider'

// eslint-disable-next-line import/order
import Nav from '$shared/components/Layout/Nav'

/* eslint-disable object-curly-newline */
describe('Nav.Wide', () => {
    it('renders logo', () => {
        const store = {
            user: {},
        }
        const el = mount((
            <MemoryRouter>
                <Provider store={mockStore(store)}>
                    <Nav />
                </Provider>
            </MemoryRouter>
        ))

        expect(el.find('Logo').exists()).toBe(true)
    })

    describe('When the user is not signed in', () => {
        it('renders the menu links', () => {
            const store = {
                user: {},
            }
            const el = mount((
                <MemoryRouter>
                    <Provider store={mockStore(store)}>
                        <Nav />
                    </Provider>
                </MemoryRouter>
            ))

            expect(el.find({ href: '/core/streams' }).exists()).toBe(true)
            expect(el.find({ href: '/marketplace' }).exists()).toBe(true)
            expect(el.find({ href: '/docs/getting-started' }).exists()).toBe(true)
            debugger
            expect(el.find({ href: '/login?redirect=%2F' }).exists()).toBe(true)
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
                        <Nav />
                    </Provider>
                </MemoryRouter>
            ))

            expect(el.find({ href: '/core/streams' }).exists()).toBe(true)
            expect(el.find({ href: '/marketplace' }).exists()).toBe(true)
            expect(el.find({ href: '/docs/getting-started' }).exists()).toBe(true)
            expect(el.find({ href: '/login' }).exists()).toBe(false)
            expect(el.find({ href: '/logout' }).exists()).toBe(true)
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
                        <Nav />
                    </Provider>
                </MemoryRouter>
            ))

            expect(el.find('User__Avatarless').exists()).toBe(true)
            expect(el.find('User__UsernameCopy').text()).toMatch(/tester1@streamr\.com/)
        })
    })
})

/* eslint-enable object-curly-newline */
