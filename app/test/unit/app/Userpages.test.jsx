import React from 'react'
import { MemoryRouter, Switch } from 'react-router-dom'
import { mount } from 'enzyme'

import UserpagesRouter from '$mp/../app/Userpages'

/* eslint-disable react/prop-types */
jest.mock('$userpages/components/DashboardPage/List', () => ({
    __esModule: true,
    default: () => (
        <div>Dashboard list</div>
    ),
}))
jest.mock('$userpages/components/CanvasPage/List', () => ({
    __esModule: true,
    default: () => (
        <div>Canvas list</div>
    ),
}))
jest.mock('$userpages/components/StreamPage', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Stream {match.params.id} view/edit page</div>
    ),
}))
jest.mock('$userpages/components/StreamPage/List', () => ({
    __esModule: true,
    default: () => (
        <div>Stream list</div>
    ),
}))
jest.mock('$userpages/components/NewStreamPage', () => ({
    __esModule: true,
    default: () => (
        <div>New stream page</div>
    ),
}))
jest.mock('$userpages/components/StreamLivePreview', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Stream {match.params.streamId} preview</div>
    ),
}))
jest.mock('$userpages/components/TransactionPage/List', () => ({
    __esModule: true,
    default: () => (
        <div>Transaction list</div>
    ),
}))
jest.mock('$userpages/components/ProfilePage', () => ({
    __esModule: true,
    default: () => (
        <div>Profile page</div>
    ),
}))
jest.mock('$userpages/components/PurchasesPage', () => ({
    __esModule: true,
    default: () => (
        <div>Purchases list</div>
    ),
}))
jest.mock('$userpages/components/ProductsPage', () => ({
    __esModule: true,
    default: () => (
        <div>Products list</div>
    ),
}))
jest.mock('$userpages/components/ProductsPage/Stats', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Product {match.params.id} stats</div>
    ),
}))
jest.mock('$userpages/components/ProductsPage/Members', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Product {match.params.id} members</div>
    ),
}))
jest.mock('$mp/containers/EditProductPage', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Product {match.params.id} editor</div>
    ),
}))
jest.mock('$auth/utils/userAuthenticated', () => ({
    __esModule: true,
    userIsAuthenticated: (component) => component,
}))
/* eslint-enable react/prop-types */

describe('Userpages Routes', () => {
    it('shows list of canvases', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/canvases']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Canvas list')
    })

    it('shows profile', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/profile/edit']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Profile page')
    })

    it('shows dashboard list', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/dashboards']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Dashboard list')
    })

    it('shows stream list', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/streams']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Stream list')
    })

    it('shows the new stream page', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/streams/new']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('New stream page')
    })

    it('shows stream details', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/streams/steamid123']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Stream steamid123 view/edit page')
    })

    it('shows stream preview', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/stream/preview/steamid123']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Stream steamid123 preview')
    })

    it('shows transactions list', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/transactions']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Transaction list')
    })

    it('shows purchases list', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/purchases']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Purchases list')
    })

    it('shows products list', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/products']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Products list')
    })

    it('shows product editor', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/products/123/edit']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Product 123 editor')
    })

    it('shows the data union stats page', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/products/123/stats']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Product 123 stats')
    })

    it('shows the data union members page', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/products/123/members']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Product 123 members')
    })

    it('redirects to stream list on bad route', () => {
        const el = mount((
            <MemoryRouter
                initialEntries={['/core/some/route']}
            >
                <Switch>
                    {UserpagesRouter()}
                </Switch>
            </MemoryRouter>
        ))

        expect(el.text()).toBe('Stream list')
    })
})
