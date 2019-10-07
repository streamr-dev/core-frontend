import React from 'react'
import { storiesOf } from '@storybook/react'
import * as modules from './modules'
import ModuleRenderer from '.'

const stories = storiesOf('Editor/ModuleRenderer', module)

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

Object.keys(groupedModules).sort().forEach((group) => {
    stories.add(group, () => (
        <div
            style={{
                paddingBottom: '2rem',
            }}
        >
            {groupedModules[group].map((mod) => (
                <div
                    key={mod.name}
                    style={{
                        padding: '0 2rem',
                        marginTop: '2rem',
                    }}
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
