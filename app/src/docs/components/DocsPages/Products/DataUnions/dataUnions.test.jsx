import React from 'react'
import { mount } from 'enzyme'

import DataUnions from '.'

jest.mock('$docs/components/DocsHelmet', () => ({
    __esModule: true,
    default: ({ children }) => children || '',
}))
jest.mock('$docs/components/DocsLayout', () => ({
    __esModule: true,
    default: ({ children }) => children || '',
}))
jest.mock('$docs/content/products/dataUnions.mdx', () => ({
    __esModule: true,
    default: () => (
        <div>actual article</div>
    ),
}))
jest.mock('$docs/content/products/dataUnionsPlaceholder.mdx', () => ({
    __esModule: true,
    default: () => (
        <div>placeholder</div>
    ),
}))

describe('DataUnions', () => {
    let oldDataUnionFlag

    beforeEach(() => {
        oldDataUnionFlag = process.env.DATA_UNIONS
    })

    afterEach(() => {
        process.env.DATA_UNIONS = oldDataUnionFlag
    })

    describe('without data unions (DATA_UNIONS_DOCS=undefined)', () => {
        it('Shows placeholder article', () => {
            delete process.env.DATA_UNIONS_DOCS

            const el = mount(<DataUnions />)

            expect(el.text()).toBe('placeholder')
        })
    })

    describe('with data unions (DATA_UNIONS_DOCS=on)', () => {
        it('Shows data unions article', () => {
            process.env.DATA_UNIONS_DOCS = 'on'

            const el = mount(<DataUnions />)

            expect(el.text()).toBe('actual article')
        })
    })
})
