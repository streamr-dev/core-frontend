// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import mHttp from './sources/http'
import mOr from './sources/or'
import mMqtt from './sources/mqtt'
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
        canvas={{
            id: null,
            state: 'STOPPED',
            modules: [src],
        }}
        module={src}
        layout={src.layout}
        style={{
            position: 'static',
        }}
    />
)

stories.add('all', () => (
    [mHttp, mOr, mMqtt].map((src) => (
        <Module key={src.name} src={src} />
    ))
))
