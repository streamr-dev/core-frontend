// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import UseState from '$shared/components/UseState'
import ModuleHeader from '.'

const stories =
    storiesOf('Shared/ModuleHeader', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
        }))

stories.add('default', () => (
    <UseState initialValue="Module's name">
        {(label, setLabel) => (
            <ModuleHeader
                label={label}
                onLabelChange={setLabel}
            />
        )}
    </UseState>
))
