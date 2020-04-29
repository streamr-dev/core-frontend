import React from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { mount } from 'enzyme'

import GenericErrorPage from '$shared/components/GenericErrorPage'
import DocsRouter from '$mp/../app/Docs'
import { generateNav } from '$docs/components/DocsLayout/Navigation/navLinks'

jest.mock('$shared/components/GenericErrorPage', () => ({
    __esModule: true,
    default: () => (
        <div>Error page</div>
    ),
}))

jest.mock('$docs/components/DocsPages/Introduction', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/introduction</div>
    ),
}))
jest.mock('$docs/components/DocsPages/GettingStarted', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/getting-started</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Streams/IntroToStreams', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/streams
            /docs/streams/intro-to-streams
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Streams/UsingStreamsInCore', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/streams/using-streams-in-core</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Streams/UsingStreamsViaApi', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/streams/using-streams-via-api
            /docs/api/using-streams-via-api
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Streams/UsingStreamsViaSDK', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/streams/using-streams-via-sdks</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Streams/Partitioning', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/streams/partitioning</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Streams/IntegrationPatterns', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/streams/integration-patterns</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Streams/EndToEndEncryption', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/streams/end-to-end-encryption</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Streams/DataSigningAndVerification', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/streams/data-signing-and-verification</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Canvases/IntroToCanvases', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/canvases
            /docs/canvases/intro-to-canvases
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Canvases/ModulesBasics', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/canvases/modules-basics</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Canvases/ModulesAdvanced', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/canvases/modules-advanced</div>
    ),
}))
jest.mock('$docs/components/DocsPages/ModuleReference/HelpModules', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/module-reference
            /docs/module-reference/boolean
            /docs/module-reference/custom-modules
            /docs/module-reference/input
            /docs/module-reference/integrations
            /docs/module-reference/list
            /docs/module-reference/map
            /docs/module-reference/streams
            /docs/module-reference/text
            /docs/module-reference/time-and-date
            /docs/module-reference/time-series
            /docs/module-reference/utils
            /docs/module-reference/visualizations
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Dashboards', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/dashboards</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Products/IntroToProducts', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/products
            /docs/products/intro-to-products
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Products/DataUnions', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/products/data-unions
            /docs/marketplace/data-unions
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/IntroToDataUnions', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/data-unions
            /docs/data-unions/intro-to-data-unions
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/DataUnionsInCore', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-unions/create-data-union-with-core</div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/FrameworkRoles', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-unions/framework-roles</div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/AuthAndIdentity', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-unions/auth-and-identity</div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/CreateAndMonitor', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-unions/create-and-monitor</div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/JoinAndWithdraw', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-unions/join-and-withdraw</div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/UXBestPractises', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-unions/ux-best-practises</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Tutorials/BuildingPubSub', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/tutorials
            /docs/tutorials/building-pub-sub
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Tutorials/BuildingCustomModule', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/tutorials/building-custom-canvas-module</div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataToken', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-token</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Core/IntroToCore', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/core
            /docs/core/intro-to-core
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Core/UsingCanvasesInCore', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/canvases/using-canvases-in-core</div>
    ),
}))
jest.mock('$docs/components/DocsPages/Marketplace/IntroToMarketplace', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/marketplace
            /docs/marketplace/introduction-marketplace
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/SDKs', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/sdks</div>
    ),
}))
jest.mock('$docs/components/DocsPages/API/ApiOverview', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/api
            /docs/api/api-overview
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/API/Authentication', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/api/authentication</div>
    ),
}))
jest.mock('$docs/components/DocsPages/API/ApiExplorer', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/api/api-explorer</div>
    ),
}))
jest.mock('$docs/components/DocsPages/TechnicalNotes', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/technical-notes</div>
    ),
}))

const sections = ({ dataUnions }) => {
    const docsNav = generateNav({
        dataUnions,
    })

    return Object.keys(docsNav)
}

const links = ({ section, dataUnions }) => {
    const docsNav = generateNav({
        dataUnions,
    })

    return Object.values(docsNav[section])
}

describe('Marketplace Routes', () => {
    describe('Without data unions', () => {
        describe.each(sections({
            dataUnions: true,
        }))('Smoke test routes for %s', (section) => {
            it.each(links({
                section,
                dataUnions: true,
            }))(`${section === 'Data Unions' ? 'does not show' : 'shows'} route: %s`, (url) => {
                delete process.env.DATA_UNIONS
                const el = mount((
                    <MemoryRouter
                        initialEntries={[url]}
                    >
                        <Switch>
                            {DocsRouter()}
                        </Switch>
                        <Route component={GenericErrorPage} key="NotFoundPage" />
                    </MemoryRouter>
                ))

                if (section === 'Data Unions') {
                    expect(el.text().indexOf(url) >= 0).toBe(false)
                    expect(el.text()).toBe('Error page')
                } else {
                    expect(el.text().indexOf(url) >= 0).toBe(true)
                    expect(el.text()).not.toBe('Error page')
                }
            })
        })
    })

    describe('With data unions', () => {
        describe.each(sections({
            dataUnions: true,
        }))('Smoke test routes for %s', (section) => {
            it.each(links({
                section,
                dataUnions: true,
            }))('shows route: %s', (url) => {
                process.env.DATA_UNIONS = 'on'
                const el = mount((
                    <MemoryRouter
                        initialEntries={[url]}
                    >
                        <Switch>
                            {DocsRouter()}
                        </Switch>
                        <Route component={GenericErrorPage} key="NotFoundPage" />
                    </MemoryRouter>
                ))

                expect(el.text().indexOf(url) >= 0).toBe(true)
                expect(el.text()).not.toBe('Error page')
            })
        })
    })
})
