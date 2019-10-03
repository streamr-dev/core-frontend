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

stories.add('all', () => (
    Object.entries(modules).map(([name, src]) => (
        <Module
            key={src.name}
            src={Object.assign({
                params: [],
                inputs: [],
                outputs: [],
            }, src, {
                name: src.name || `<${name}>`,
            })}
        />
    ))
))
