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

stories.add('all', () => (
    <div>
        {Object.entries(modules).map(([name, src]) => (
            <div
                key={src.name}
            >
                <Module
                    src={Object.assign({
                        params: [],
                        inputs: [],
                        outputs: [],
                    }, src, {
                        name: src.name || `<${name}>`,
                    })}
                />
            </div>
        ))}
    </div>
))
