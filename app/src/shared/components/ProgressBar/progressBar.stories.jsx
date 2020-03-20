// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { withKnobs, number } from '@storybook/addon-knobs'

import ProgressBar from '.'

const stories =
    storiesOf('Shared/ProgressBar', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '2rem',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => {
    const value = number('Value', 25, {
        range: true,
        min: 0,
        max: 100,
        step: 5,
    })

    return (
        <ProgressBar value={value} />
    )
})
