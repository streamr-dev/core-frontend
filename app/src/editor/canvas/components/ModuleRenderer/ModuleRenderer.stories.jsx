// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import src from './sources/or'
import ModuleRenderer from '.'

const stories = storiesOf('Editor/ModuleRenderer', module)

stories.add('Or', () => (
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
        canvas={{
            id: null,
            state: 'STOPPED',
            modules: [src],
        }}
        module={src}
    />
))
