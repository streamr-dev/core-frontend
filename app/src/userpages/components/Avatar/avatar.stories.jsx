// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import Avatar from '.'

const stories =
    storiesOf('Userpages/Avatar', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '3rem',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => {
    const user = {
        email: 'tester1@streamr.com',
        imageUrlLarge: boolean('showImage', true) ? 'https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg' : '',
        imageUrlSmall: '',
        name: text('Name', 'Matt Innes'),
        username: text('Username', 'matt@streamr.com'),
    }

    return (
        <Avatar
            editable={boolean('Editable', false)}
            user={user}
            onImageChange={() => Promise.resolve()}
        />
    )
})

stories.add('default (mobile)', () => {
    const user = {
        email: 'tester1@streamr.com',
        imageUrlLarge: boolean('showImage', true) ? 'https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg' : '',
        imageUrlSmall: '',
        name: text('Name', 'Matt Innes'),
        username: text('Username', 'matt@streamr.com'),
    }

    return (
        <Avatar
            editable={boolean('Editable', false)}
            user={user}
            onImageChange={() => Promise.resolve()}
        />
    )
}, {
    viewport: {
        defaultViewport: 'xs',
    },
})

stories.add('eth address', () => {
    const user = {
        email: 'tester1@streamr.com',
        imageUrlLarge: boolean('showImage', true) ? 'https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg' : '',
        imageUrlSmall: '',
        name: text('Name', 'Matt Innes'),
        username: text('Username', '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10'),
    }

    return (
        <Avatar
            editable={boolean('Editable', false)}
            user={user}
            onImageChange={() => Promise.resolve()}
        />
    )
})

stories.add('eth address (mobile)', () => {
    const user = {
        email: 'tester1@streamr.com',
        imageUrlLarge: boolean('showImage', true) ? 'https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg' : '',
        imageUrlSmall: '',
        name: text('Name', 'Matt Innes'),
        username: text('Username', '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10'),
    }

    return (
        <Avatar
            editable={boolean('Editable', false)}
            user={user}
            onImageChange={() => Promise.resolve()}
        />
    )
}, {
    viewport: {
        defaultViewport: 'xs',
    },
})
