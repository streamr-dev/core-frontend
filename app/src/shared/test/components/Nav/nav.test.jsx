import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'

import mockStore from '$testUtils/mockStoreProvider'

import Nav from '$shared/components/Nav'

/* eslint-disable react/prop-types */
jest.mock('$shared/components/Nav/DropdownItem', () => ({
    __esModule: true,
    default: ({ to, children }) => (
        <div id={to}>{children}</div>
    ),
}))
jest.mock('$shared/components/Nav/LinkItem', () => ({
    __esModule: true,
    default: ({ to, children }) => (
        <div id={to}>{children}</div>
    ),
}))
jest.mock('$shared/components/Nav/AvatarItem', () => ({
    __esModule: true,
    default: ({ user }) => (
        <div id="avatar">{user.username}</div>
    ),
}))
jest.mock('$shared/components/Nav/ActivityItem', () => ({
    __esModule: true,
    default: () => (
        <div id="activity" />
    ),
}))

/* eslint-enable react/prop-types */

/* eslint-disable object-curly-newline */
describe('Nav', () => {
    let oldDataUnionsDocsFlag

    beforeEach(() => {
        oldDataUnionsDocsFlag = process.env.DATA_UNIONS_DOCS
    })

    afterEach(() => {
        process.env.DATA_UNIONS_DOCS = oldDataUnionsDocsFlag
    })

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

        expect(el.find('LogoItem').exists()).toBe(true)
    })

    describe('When the user is not signed in', () => {
        it('renders the menu links', () => {
            delete process.env.DATA_UNIONS_DOCS
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

            expect(el.find({ id: '/core/streams' }).exists()).toBe(true)
            expect(el.find({ id: '/core/streams' }).children().length).toBe(6)
            expect(el.find({ id: '/marketplace' }).exists()).toBe(true)
            expect(el.find({ id: '/docs' }).exists()).toBe(true)
            expect(el.find({ id: '/docs' }).children().length).toBe(5)
            expect(el.find({ id: '/login' }).exists()).toBe(true)
            expect(el.find({ id: '/signup' }).exists()).toBe(true)
        })
    })

    describe('When the user is signed in', () => {
        it('renders the menu links', () => {
            delete process.env.DATA_UNIONS_DOCS
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

            expect(el.find({ id: '/core/streams' }).exists()).toBe(true)
            expect(el.find({ id: '/core/streams' }).children().length).toBe(6)
            expect(el.find({ id: '/marketplace' }).exists()).toBe(true)
            expect(el.find({ id: '/docs' }).exists()).toBe(true)
            expect(el.find({ id: '/docs' }).children().length).toBe(5)
            expect(el.find({ id: '/login' }).exists()).toBe(false)
            expect(el.find({ id: '/signup' }).exists()).toBe(false)
        })

        it('renders the activity bell icon', () => {
            delete process.env.DATA_UNIONS
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

            expect(el.find({ id: 'activity' }).exists()).toBe(true)
        })

        it('renders the user avatar', () => {
            delete process.env.DATA_UNIONS_DOCS
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

            expect(el.find({ id: 'avatar' }).exists()).toBe(true)
            expect(el.find({ id: 'avatar' }).text()).toMatch(/tester1@streamr.com/)
        })
    })

    describe('Docs links', () => {
        it('does not show Data unions link by default (DATA_UNIONS_DOCS=undefined', () => {
            delete process.env.DATA_UNIONS_DOCS
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

            const docsEl = el.find({ id: '/docs' })
            expect(docsEl.exists()).toBe(true)
            expect(el.find({ id: '/docs' }).children().length).toBe(5)
            expect(docsEl.childAt(0).text()).toBe('gettingStarted')
            expect(docsEl.childAt(1).text()).toBe('streams')
            expect(docsEl.childAt(2).text()).toBe('canvases')
            expect(docsEl.childAt(3).text()).toBe('dashboards')
            expect(docsEl.childAt(4).text()).toBe('products')
        })

        it('shows Data unions link when DATA_UNIONS_DOCS is defined (DATA_UNIONS_DOCS=on)', () => {
            process.env.DATA_UNIONS_DOCS = 'on'
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

            const docsEl = el.find({ id: '/docs' })
            expect(docsEl.exists()).toBe(true)
            expect(el.find({ id: '/docs' }).children().length).toBe(6)
            expect(docsEl.childAt(0).text()).toBe('gettingStarted')
            expect(docsEl.childAt(1).text()).toBe('streams')
            expect(docsEl.childAt(2).text()).toBe('canvases')
            expect(docsEl.childAt(3).text()).toBe('dashboards')
            expect(docsEl.childAt(4).text()).toBe('products')
            expect(docsEl.childAt(5).text()).toBe('dataUnions')
        })
    })
})

/* eslint-enable object-curly-newline */
