import React from 'react'
import { mount } from 'enzyme'
import Provider from 'streamr-client-react'

import * as modules from './modules'
import ModuleRenderer from '.'

const Module = ({ src }) => (
    <ModuleRenderer
        canvasEditable={false}
        canvasAdjustable={false}
        api={{
            moduleSidebarOpen: () => {},
            port: {
                onChange: () => {},
                setPortOptions: () => {},
            },
            updateModule: () => {},
            selectModule: () => {},
            setCanvas: () => {},
        }}
        module={src}
        layout={src.layout}
        style={{
            position: 'static',
            width: 'fit-content',
        }}
    />
)

const groupedModules = Object.values(modules).reduce((memo, mod) => (mod.path ? {
    ...memo,
    [mod.path]: [...(memo[mod.path] || []), mod],
} : memo), {})

describe('ModuleRenderer', () => {
    const moduleTests = [].concat(...Object.keys(groupedModules).sort().map((key) => groupedModules[key].map((m) => [key, m.name, m])))
    test.each(moduleTests)('render %s - %s', (group, name, m) => {
        const result = mount((
            <Provider autoConnect={false}>
                <Module
                    src={Object.assign({
                        params: [],
                        inputs: [],
                        outputs: [],
                    }, m, {
                        name: m.name || '<Empty>',
                    })}
                />
            </Provider>
        ))
        expect(result).toBeTruthy()
        result.unmount()
    })
})
