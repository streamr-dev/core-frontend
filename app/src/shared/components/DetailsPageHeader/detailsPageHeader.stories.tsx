import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
const stories = storiesOf('Shared/DetailsPageHeaderz', module).addDecorator(
    styles({
        padding: '2rem',
        color: '#000'
    }),
)
stories.add('default', () => (
    <p>Elo</p>
))
