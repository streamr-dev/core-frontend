import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { StreamConnect } from '$shared/components/StreamConnect/index'
const stories = storiesOf('Shared/StreamConnect', module).addDecorator(
    styles({
        padding: '2rem',
        color: '#000'
    }),
)
stories.add('default', () => (
    <StreamConnect streamId={'0xdjsdgfjkj32k3j423dfsd'}/>
))
