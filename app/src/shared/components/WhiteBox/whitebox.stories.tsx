import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import {WhiteBox} from '.'
const stories = storiesOf('Shared/WhiteBox', module).addDecorator(
    styles({
        padding: '2rem',
        color: '#000',
        backgroundColor: '#ccc'
    }),
)
stories.add('default', () => (
    <WhiteBox>
        <p>This is just a white box container with defined paddings for all breakpoints. Its purpose is to be used in the new HUB design</p>
    </WhiteBox>
))
