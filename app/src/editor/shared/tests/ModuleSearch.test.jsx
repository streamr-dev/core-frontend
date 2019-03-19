import React from 'react'
import { shallow } from 'enzyme'

import ModuleSearch from '$editor/canvas/components/ModuleSearch'

describe('ModuleSearch', () => {
    it('should render an empty list by default', () => {
        const el = shallow(<ModuleSearch />)
        expect(el.find('div[role="option"]')).toHaveLength(0)
    })

    it('should render module results', () => {
        const modules = [
            {
                id: 1,
                name: 'First module',
                path: 'Modules',
            },
            {
                id: 2,
                name: 'Second module',
                path: 'Modules',
            },
        ]

        const el = shallow(<ModuleSearch />)
        el.setState({
            matchingModules: modules,
            matchingStreams: [],
        })

        expect(el.find('div[role="option"]')).toHaveLength(2)
    })

    it('should render stream results', () => {
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
            matchingModules: [],
            matchingStreams: streams,
        })

        expect(el.find('div[role="option"]')).toHaveLength(2)
    })
})
