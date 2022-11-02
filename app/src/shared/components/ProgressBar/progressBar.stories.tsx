import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import ProgressBar from '.'
const stories = storiesOf('Shared/ProgressBar', module)
    .addDecorator(
        styles({
            color: '#323232',
            padding: '2rem',
        }),
    )
stories.add('default', () => {
    const value = 25
    return <ProgressBar value={value} />
})
