import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { action } from '@storybook/addon-actions'
import Text from '.'
const stories = storiesOf('Shared/Text', module)
    .addDecorator(
        styles({
            background: 'white',
            color: '#323232',
            margin: '3rem',
        }),
    )
stories.add('native', () => <input />)
stories.add('no events', () => <Text />)
stories.add('default', () => (
    <Text
        smartCommit={false}
        onChange={action('onChange')}
        onCommit={action('onCommit')}
        noEmptyCommit={false}
        revertOnEscape={false}
    />
))
