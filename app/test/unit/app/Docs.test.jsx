import React from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { mount } from 'enzyme'

import GenericErrorPage from '$shared/components/GenericErrorPage'
import { generateMap } from '$docs/docsMap'
import DocsRouter from '$mp/../app/Docs'

jest.mock('$shared/components/GenericErrorPage', () => ({
    __esModule: true,
    default: () => (
        'Error page'
    ),
}))

jest.mock('$docs/components/Pages/Introduction', () => ({
    __esModule: true,
    default: () => (
        '/docs/introduction'
    ),
}))
jest.mock('$docs/components/Pages/GettingStarted', () => ({
    __esModule: true,
    default: () => (
        '/docs/getting-started'
    ),
}))
jest.mock('$docs/components/Pages/Streams/IntroToStreams', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/streams
            /docs/streams/intro-to-streams
        `
    ),
}))
jest.mock('$docs/components/Pages/Streams/UsingStreamsInCore', () => ({
    __esModule: true,
    default: () => (
        '/docs/streams/using-streams-in-core'
    ),
}))
jest.mock('$docs/components/Pages/Streams/UsingStreamsViaApi', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/streams/using-streams-via-api
            /docs/api/using-streams-via-api
        `
    ),
}))
jest.mock('$docs/components/Pages/Streams/UsingStreamsViaSdk', () => ({
    __esModule: true,
    default: () => (
        '/docs/streams/using-streams-via-sdk'
    ),
}))
jest.mock('$docs/components/Pages/Streams/Partitioning', () => ({
    __esModule: true,
    default: () => (
        '/docs/streams/partitioning'
    ),
}))
jest.mock('$docs/components/Pages/Streams/IntegrationPatterns', () => ({
    __esModule: true,
    default: () => (
        '/docs/streams/integration-patterns'
    ),
}))
jest.mock('$docs/components/Pages/Streams/EndToEndEncryption', () => ({
    __esModule: true,
    default: () => (
        '/docs/streams/end-to-end-encryption'
    ),
}))
jest.mock('$docs/components/Pages/Streams/DataSigningAndVerification', () => ({
    __esModule: true,
    default: () => (
        '/docs/streams/data-signing-and-verification'
    ),
}))
jest.mock('$docs/components/Pages/Canvases/IntroToCanvases', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/canvases
            /docs/canvases/intro-to-canvases
        `
    ),
}))
jest.mock('$docs/components/Pages/Canvases/ModulesBasics', () => ({
    __esModule: true,
    default: () => (
        '/docs/canvases/modules-basics'
    ),
}))
jest.mock('$docs/components/Pages/Canvases/ModulesAdvanced', () => ({
    __esModule: true,
    default: () => (
        '/docs/canvases/modules-advanced'
    ),
}))
jest.mock('$docs/components/Pages/ModuleReference/HelpModules', () => ({
    __esModule: true,
    default: () => (
        `
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
        `
    ),
}))
jest.mock('$docs/components/Pages/Dashboards', () => ({
    __esModule: true,
    default: () => (
        '/docs/dashboards'
    ),
}))
jest.mock('$docs/components/Pages/Products/CreateProduct', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/products
            /docs/products/create-product
        `
    ),
}))
jest.mock('$docs/components/Pages/DataUnions/IntroToDataUnions', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/data-unions
            /docs/data-unions/intro-to-data-unions
        `
    ),
}))
jest.mock('$docs/components/Pages/DataUnions/DataUnionsCore', () => ({
    __esModule: true,
    default: () => (
        '/docs/data-unions/create-data-union-with-core'
    ),
}))
jest.mock('$docs/components/Pages/DataUnions/FrameworkRoles', () => ({
    __esModule: true,
    default: () => (
        '/docs/data-unions/framework-roles'
    ),
}))
jest.mock('$docs/components/Pages/DataUnions/AuthAndIdentity', () => ({
    __esModule: true,
    default: () => (
        '/docs/data-unions/auth-and-identity'
    ),
}))
jest.mock('$docs/components/Pages/DataUnions/CreateAndMonitor', () => ({
    __esModule: true,
    default: () => (
        '/docs/data-unions/create-and-monitor'
    ),
}))
jest.mock('$docs/components/Pages/DataUnions/JoinAndWithdraw', () => ({
    __esModule: true,
    default: () => (
        '/docs/data-unions/join-and-withdraw'
    ),
}))
jest.mock('$docs/components/Pages/DataUnions/UXBestPractices', () => ({
    __esModule: true,
    default: () => (
        '/docs/data-unions/ux-best-practices'
    ),
}))
jest.mock('$docs/components/Pages/Tutorials/BuildingPubSub', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/tutorials
            /docs/tutorials/building-pub-sub
        `
    ),
}))
jest.mock('$docs/components/Pages/Tutorials/BuildingCustomModule', () => ({
    __esModule: true,
    default: () => (
        '/docs/tutorials/building-custom-canvas-module'
    ),
}))
jest.mock('$docs/components/Pages/DataToken', () => ({
    __esModule: true,
    default: () => (
        '/docs/data-token'
    ),
}))
jest.mock('$docs/components/Pages/Core/IntroToCore', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/core
            /docs/core/intro-to-core
        `
    ),
}))
jest.mock('$docs/components/Pages/Core/UsingCanvasesInCore', () => ({
    __esModule: true,
    default: () => (
        '/docs/canvases/using-canvases-in-core'
    ),
}))
jest.mock('$docs/components/Pages/Marketplace/IntroToMarketplace', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/marketplace
            /docs/marketplace/introduction-marketplace
        `
    ),
}))
jest.mock('$docs/components/Pages/Sdk/Overview', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/sdk
            /docs/sdk/overview
        `
    ),
}))
jest.mock('$docs/components/Pages/Sdk/Javascript', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/sdk/javascript-sdk
        `
    ),
}))
jest.mock('$docs/components/Pages/Sdk/Java', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/sdk/java-sdk
        `
    ),
}))
jest.mock('$docs/components/Pages/Sdk/Python', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/sdk/python-sdk
        `
    ),
}))
jest.mock('$docs/components/Pages/Api/Overview', () => ({
    __esModule: true,
    default: () => (
        `
            /docs/api
            /docs/api/api-overview
        `
    ),
}))
jest.mock('$docs/components/Pages/Api/Authentication', () => ({
    __esModule: true,
    default: () => (
        '/docs/api/authentication'
    ),
}))
jest.mock('$docs/components/Pages/ApiExplorer', () => ({
    __esModule: true,
    default: () => (
        '/docs/API-explorer'
    ),
}))
jest.mock('$docs/components/Pages/TechnicalNotes', () => ({
    __esModule: true,
    default: () => (
        '/docs/technical-notes'
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
    describe.each(sections({
        dataUnions: true,
    }))('Smoke test routes for %s', (section) => {
        it.each(links({
            section,
            dataUnions: true,
        }))('shows route: %s', (url) => {
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
