// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import Avatar from '.'

const stories =
    storiesOf('Userpages/Avatar', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '3rem',
        }))
        .addDecorator(withKnobs)

const user = {
    email: 'tester1@streamr.com',
    imageUrlLarge: boolean('showImage', true) ? 'https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg' : '',
    imageUrlSmall: '',
    name: text('Name', 'Matt Innes'),
    username: text('Username', 'matt@streamr.com'),
}

stories.add('default', () => (
    <Avatar
        user={user}
        onImageChange={action('onImageChange')}
    />
))

stories.add('default (mobile)', () => (
    <Avatar
        user={user}
        onImageChange={() => Promise.resolve()}
    />
), {
    viewport: {
        defaultViewport: 'xs',
    },
})

stories.add('eth address', () => (
    <Avatar
        user={user}
        onImageChange={() => Promise.resolve()}
    />
))

stories.add('eth address (mobile)', () => (
    <Avatar
        user={user}
        onImageChange={() => Promise.resolve()}
    />
), {
    viewport: {
        defaultViewport: 'xs',
    },
})
