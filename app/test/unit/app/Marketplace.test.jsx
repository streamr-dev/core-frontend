import React from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { mount } from 'enzyme'

import GenericErrorPage from '$shared/components/GenericErrorPage'
import MarketplaceRouter from '$mp/../app/Marketplace'

/* eslint-disable react/prop-types */
jest.mock('$mp/containers/Products', () => ({
    __esModule: true,
    default: () => (
        <div>Main page</div>
    ),
}))
jest.mock('$mp/containers/ProductPage', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Product {match.params.id} page</div>
    ),
}))
jest.mock('$mp/containers/deprecated/ProductPage', () => ({
    __esModule: true,
    default: ({ match, overlayPublishDialog, overlayPurchaseDialog }) => (
        <div>
            Deprecated product {match.params.id} page
            {overlayPublishDialog && (' (publish)')}
            {overlayPurchaseDialog && (' (purchase)')}
        </div>
    ),
}))
jest.mock('$mp/containers/StreamPreviewPage', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Product {match.params.id} preview</div>
    ),
}))
jest.mock('$mp/components/NewProductPage', () => ({
    __esModule: true,
    default: () => (
        <div>New product</div>
    ),
}))
jest.mock('$shared/components/GenericErrorPage', () => ({
    __esModule: true,
    default: () => (
        <div>Error page</div>
    ),
}))
jest.mock('$mp/containers/deprecated/EditProductPage', () => ({
    __esModule: true,
    default: ({ match }) => (
        <div>Edit product {match.params.id} page</div>
    ),
}))
jest.mock('$auth/utils/userAuthenticated', () => ({
    __esModule: true,
    userIsAuthenticated: (component) => component,
}))
/* eslint-enable react/prop-types */

describe('Marketplace Routes', () => {
    let oldMpContractFlag

    beforeEach(() => {
        oldMpContractFlag = process.env.NEW_MP_CONTRACT
    })

    afterEach(() => {
        process.env.NEW_MP_CONTRACT = oldMpContractFlag
    })

    describe('With community product (NEW_MP_CONTRACT=on)', () => {
        it('shows main page', () => {
            process.env.NEW_MP_CONTRACT = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Main page')
        })

        it('shows product page', () => {
            process.env.NEW_MP_CONTRACT = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Product 123 page')
        })

        it('shows stream preview', () => {
            process.env.NEW_MP_CONTRACT = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123/streamPreview/stream456']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Product 123 preview')
        })

        it('shows new product page', () => {
            process.env.NEW_MP_CONTRACT = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/core/products/new']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('New product')
        })

        it('does not show previous new product page', () => {
            process.env.NEW_MP_CONTRACT = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/create']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            // "create" is treated as an id
            expect(el.text()).toBe('Product create page')
        })

        it('does not show edit product page', () => {
            process.env.NEW_MP_CONTRACT = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123/edit']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                        <Route component={GenericErrorPage} key="NotFoundPage" />
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Error page')
        })

        it('does not show publish route', () => {
            process.env.NEW_MP_CONTRACT = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123/publish']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                        <Route component={GenericErrorPage} key="NotFoundPage" />
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Error page')
        })

        it('does not show purchase route', () => {
            process.env.NEW_MP_CONTRACT = 'on'
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123/purchase']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                        <Route component={GenericErrorPage} key="NotFoundPage" />
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Error page')
        })
    })

    describe('With community product (NEW_MP_CONTRACT="")', () => {
        it('shows main page', () => {
            delete process.env.NEW_MP_CONTRACT
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Main page')
        })

        it('shows deprecated product page', () => {
            delete process.env.NEW_MP_CONTRACT
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Deprecated product 123 page')
        })

        it('shows stream preview', () => {
            delete process.env.NEW_MP_CONTRACT
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123/streamPreview/stream456']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Product 123 preview')
        })

        it('shows previous new product page', () => {
            delete process.env.NEW_MP_CONTRACT
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/create']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Edit product  page')
        })

        it('shows edit product page', () => {
            delete process.env.NEW_MP_CONTRACT
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123/edit']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Edit product 123 page')
        })

        it('shows publish route', () => {
            delete process.env.NEW_MP_CONTRACT
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123/publish']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            // publish dialog is overlaid on top of the product page
            expect(el.text()).toBe('Deprecated product 123 page (publish)')
        })

        it('shows purchase route', () => {
            delete process.env.NEW_MP_CONTRACT
            const el = mount((
                <MemoryRouter
                    initialEntries={['/marketplace/products/123/purchase']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                    </Switch>
                </MemoryRouter>
            ))

            // purchase dialog is overlaid on top of the product page
            expect(el.text()).toBe('Deprecated product 123 page (purchase)')
        })

        it('does not show new product page', () => {
            delete process.env.NEW_MP_CONTRACT
            const el = mount((
                <MemoryRouter
                    initialEntries={['/core/products/new']}
                >
                    <Switch>
                        {MarketplaceRouter()}
                        <Route component={GenericErrorPage} key="NotFoundPage" />
                    </Switch>
                </MemoryRouter>
            ))

            expect(el.text()).toBe('Error page')
        })
    })
})
