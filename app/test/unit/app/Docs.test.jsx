import React from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { mount } from 'enzyme'

import GenericErrorPage from '$shared/components/GenericErrorPage'
import DocsRouter from '$mp/../app/Docs'
import { generateMap } from '$docs/docsMap'

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
        <div>/docs/data-unions/build-data-unions-in-core</div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/DataUnionsIntegration', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-unions/integrate-data-unions-into-your-app</div>
    ),
}))
jest.mock('$docs/components/DocsPages/DataUnions/DataUnionsInSDK', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/data-unions/build-data-unions-with-sdk</div>
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
jest.mock('$docs/components/DocsPages/Sdks/SdkOverview', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/sdks
            /docs/sdks/overview
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Sdks/JavascriptSdk', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/sdks/javascript-sdk
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Sdks/JavaSdk', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/sdks/java-sdk
        </div>
    ),
}))
jest.mock('$docs/components/DocsPages/Sdks/PythonSdk', () => ({
    __esModule: true,
    default: () => (
        <div>
            /docs/sdks/python-sdk
        </div>
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
jest.mock('$docs/components/DocsPages/ApiExplorer', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/api-explorer</div>
    ),
}))
jest.mock('$docs/components/DocsPages/TechnicalNotes', () => ({
    __esModule: true,
    default: () => (
        <div>/docs/technical-notes</div>
    ),
}))

const sections = ({ dataUnions }) => {
    const docsMap = generateMap({
        dataUnions,
    })

    return Object.keys(docsMap)
}

const links = ({ section, dataUnions }) => {
    const docsMap = generateMap({
        dataUnions,
    })

    return Object.keys(docsMap[section]).map((doc) => docsMap[section][doc].path)
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
                delete process.env.DATA_UNIONS_DOCS
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
                process.env.DATA_UNIONS_DOCS = 'on'
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
