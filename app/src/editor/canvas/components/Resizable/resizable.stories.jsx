// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import UseState from '$shared/components/UseState'
import styles from '@sambego/storybook-styles'
import Resizeable from '.'

const stories =
    storiesOf('Shared/Resizable', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
        }))

stories.add('default', () => (
    <UseState
        initialValue={{
            height: 100,
            width: 100,
        }}
    >
        {({ width, height }, setSize) => (
            <Resizeable
                height={height}
                onResize={setSize}
                onSizeChange={() => {}}
                scale={1}
                width={width}
            >
                Hello world.
            </Resizeable>
        )}
    </UseState>
))
