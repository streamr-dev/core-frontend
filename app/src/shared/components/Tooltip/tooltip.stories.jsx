// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { withKnobs } from '@storybook/addon-knobs'

import Tooltip from '.'

const stories =
    storiesOf('Shared/Tooltip', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem 10rem',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => (
    <Tooltip value="This is a tooltip">
        Hover to show tooltip
    </Tooltip>
))

stories.add('bottom', () => (
    <Tooltip value="This is a tooltip" placement={Tooltip.BOTTOM}>
        Hover to show tooltip
    </Tooltip>
))
