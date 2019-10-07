import React from 'react'
import { storiesOf } from '@storybook/react'
import * as modules from './modules'
import ModuleRenderer from '.'

const stories = storiesOf('Editor/ModuleRenderer', module)

const Module = ({ src }) => (
    <ModuleRenderer
        canvasEditable
        canvasAdjustable
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
            pointerEvents: 'none',
        }}
    />
)

const groupedModules = Object.values(modules).reduce((memo, mod) => (mod.path ? {
    ...memo,
    [mod.path]: [...(memo[mod.path] || []), mod],
} : memo), {})

Object.keys(groupedModules).sort().forEach((group) => {
    stories.add(group, () => (
        <div>
            {groupedModules[group].map((mod) => (
                <div
                    key={mod.name}
                >
                    <Module
                        src={Object.assign({
                            params: [],
                            inputs: [],
                            outputs: [],
                        }, mod, {
                            name: mod.name || '<Empty>',
                        })}
                    />
                </div>
            ))}
        </div>
    ))
})
