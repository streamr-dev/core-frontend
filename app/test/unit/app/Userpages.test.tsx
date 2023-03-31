import React from 'react'
import { MemoryRouter, Switch } from 'react-router-dom'
import { mount } from 'enzyme'
import UserpagesRouter from '$mp/../app/Userpages'

/* eslint-disable react/prop-types */
jest.mock('$app/src/pages/StreamEditPage', () => ({
    __esModule: true,
    default: ({ match }) => `Stream ${match.params.id} view/edit page`,
}))
jest.mock('$app/src/pages/StreamCreatePage', () => ({
    __esModule: true,
    default: () => 'New stream page',
}))
jest.mock('$userpages/components/TransactionPage/List', () => ({
    __esModule: true,
    default: () => 'Transaction list',
}))
jest.mock('$userpages/components/ProfilePage', () => ({
    __esModule: true,
    default: () => 'Profile page',
}))
jest.mock('$userpages/components/PurchasesPage', () => ({
    __esModule: true,
    default: () => 'Subscriptions',
}))
jest.mock('$userpages/components/ProductsPage', () => ({
    __esModule: true,
    default: () => 'Products list',
}))
jest.mock('$auth/utils/userAuthenticated', () => ({
    __esModule: true,
    UserIsAuthenticatedRoute: ({children}) => <>{children}</>,
}))

jest.mock('$mp/containers/ProjectEditing/EditProjectPage', () => ({
    __esModule: true,
    default: () => 'Edit product',
}))

/* eslint-enable react/prop-types */
describe('Userpages Routes', () => {
    it('shows the new stream page', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/streams/new']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('New stream page')
    })
    it('shows stream details', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/streams/steamid123']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Stream steamid123 view/edit page')
    })
    it('shows transactions list', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/transactions']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Transaction list')
    })
    it('shows subscriptions list', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/subscriptions']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Subscriptions')
    })
    it('shows products list', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/products']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Products list')
    })
    it('shows edit product page', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/products/PRODUCTID/edit']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Edit product')
    })
})
