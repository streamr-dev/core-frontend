import React from 'react'
import { storiesOf } from '@storybook/react'
import * as modules from './modules'
import ModuleRenderer from '.'
import { LEVELS } from '$editor/canvas/state/messages'

const stories = storiesOf('Editor/ModuleRenderer', module)

export const Module = ({ src, ...props }) => (
    <ModuleRenderer
        canvasEditable={false}
        canvasAdjustable={false}
        api={{
            moduleSidebarOpen: () => {},
            consoleSidebarOpen: () => {},
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
        {...props}
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

const badgeStories = storiesOf('Editor/ModuleRenderer/badges', module)
LEVELS.forEach((level) => {
    badgeStories.add(level, () => (
        <div
            style={{
                padding: '0 2rem',
                marginTop: '2rem',
            }}
        >
            <Module
                badgeLevel={level}
                src={{
                    name: '<Empty>',
                    params: [],
                    inputs: [],
                    outputs: [],
                }}
                canvasEditable
            />
        </div>
    ))
})
