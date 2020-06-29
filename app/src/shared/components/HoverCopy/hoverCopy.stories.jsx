// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'

import HoverCopy from '.'

const stories = storiesOf('Shared/HoverCopy', module)
    .addDecorator(styles({
        color: '#323232',
        fontSize: '16px',
    }))

stories.add('default', () => (
    <HoverCopy value="something">
        Hover over me to show copy icon
    </HoverCopy>
))
