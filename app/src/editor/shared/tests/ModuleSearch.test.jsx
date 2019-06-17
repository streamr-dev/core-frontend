import React from 'react'
import { shallow } from 'enzyme'

import ModuleSearch from '$editor/canvas/components/ModuleSearch'

describe.skip('ModuleSearch', () => {
    it('should render an empty list by default', () => {
        const el = shallow(<ModuleSearch />)
        expect(el.find('ModuleMenuCategory')).toHaveLength(0)
    })

    it('should render module tree when there is no search text', () => {
        const modules = [
            {
                id: 1,
                name: 'First module',
                path: 'Test: Cat1',
            },
            {
                id: 2,
                name: 'Second module',
                path: 'Another category',
            },
        ]

        const el = shallow(<ModuleSearch />)

        el.instance().getMappedModuleTree = jest.fn(() => modules)
        el.update()

        el.setState({
            search: '',
            allModules: modules,
        })

        expect(el.find('ModuleMenuCategory')).toHaveLength(2)
    })

    it('should render module results when searched', () => {
        const modules = [
            {
                id: 1,
                name: 'First module',
                path: 'Test: Cat1',
            },
            {
                id: 2,
                name: 'Second module',
                path: 'Another category',
            },
            {
                id: 3,
                name: 'Third module',
                path: 'Another category',
            },
        ]

        const el = shallow(<ModuleSearch />)
        el.setState({
            search: 'does not matter',
            matchingModules: modules,
            matchingStreams: [],
        })

        expect(el.find('div[role="option"]')).toHaveLength(3)
    })

    it('should render stream results when searched', () => {
        const streams = [
            {
                id: 1,
                name: 'First stream',
                description: 'Test',
            },
            {
                id: 2,
                name: 'Second stream',
                description: 'Test',
            },
        ]

        const el = shallow(<ModuleSearch />)
        el.setState({
            search: 'does not matter',
            matchingModules: [],
            matchingStreams: streams,
        })

        expect(el.find('div[role="option"]')).toHaveLength(2)
    })
})
