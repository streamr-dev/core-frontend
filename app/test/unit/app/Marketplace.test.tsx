import React from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { mount } from 'enzyme'
import MarketplaceRouter from '$mp/../app/Marketplace'
import GenericErrorPage from '$shared/components/GenericErrorPage'

/* eslint-disable react/prop-types */
jest.mock('$mp/containers/Projects', () => ({
    __esModule: true,
    default: () => 'Main page',
}))
jest.mock('$mp/containers/ProjectPage', () => ({
    __esModule: true,
    default: ({ match }) => `Product ${match.params.id} page - project overview`,
}))
jest.mock('$mp/containers/ProjectPage/ProjectConnectPage', () => ({
    __esModule: true,
    default: ({ match }) => `Product ${match.params.id} page - connect tab`,
}))
jest.mock('$mp/containers/ProjectPage/ProjectLiveDataPage', () => ({
    __esModule: true,
    default: ({ match }) => `Product ${match.params.id} page - live data tab`,
}))
jest.mock('$mp/containers/ProjectEditing/NewProjectPage', () => ({
    __esModule: true,
    default: () => 'New project',
}))
jest.mock('$shared/components/GenericErrorPage', () => ({
    __esModule: true,
    default: () => 'Error page',
}))
jest.mock('$auth/utils/userAuthenticated', () => ({
    __esModule: true,
    UserIsAuthenticatedRoute: ({children}) => <>{children}</>,
}))


/* eslint-enable react/prop-types */
describe('Marketplace Routes', () => {
    it('shows main page', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/marketplace']}>
                <Switch>{MarketplaceRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Main page')
    })
    it('shows product page', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/marketplace/products/123']}>
                <Switch>{MarketplaceRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Product 123 page - project overview')
    })
    it('shows new project page', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/products/new']}>
                <Switch>{MarketplaceRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('New project')
    })
    it('does not show edit product page', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/marketplace/products/123/edit']}>
                <Switch>
                    {MarketplaceRouter()}
                    <Route component={GenericErrorPage} key="NotFoundPage" />
                </Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Error page')
    })
    it('does not show publish route', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/marketplace/products/123/publish']}>
                <Switch>
                    {MarketplaceRouter()}
                    <Route component={GenericErrorPage} key="NotFoundPage" />
                </Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Error page')
    })
    it('does not show purchase route', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/marketplace/products/123/purchase']}>
                <Switch>
                    {MarketplaceRouter()}
                    <Route component={GenericErrorPage} key="NotFoundPage" />
                </Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Error page')
    })
})
