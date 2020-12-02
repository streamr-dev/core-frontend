// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import Balance from '../Balance'

import Avatar from '.'

const stories =
    storiesOf('Userpages/Avatar', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '3rem',
        }))
        .addDecorator(withKnobs)

const emailUser = {
    email: 'tester1@streamr.com',
    name: 'Matt Innes',
    username: 'matt@streamr.com',
}

const emailUserWithImage = {
    ...emailUser,
    imageUrlLarge: 'https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg',
    imageUrlSmall: '',
}

const ethUser = {
    name: 'Anonymous User',
    username: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
}

stories.add('default', () => (
    <Avatar user={emailUser}>
        {emailUser.username}
    </Avatar>
))

stories.add('default (mobile)', () => (
    <Avatar user={emailUser}>
        {emailUser.username}
    </Avatar>
), {
    viewport: {
        defaultViewport: 'xs',
    },
})

stories.add('with image', () => (
    <Avatar user={emailUserWithImage}>
        {emailUserWithImage.username}
    </Avatar>
))

stories.add('with image (mobile)', () => (
    <Avatar user={emailUserWithImage}>
        {emailUserWithImage.username}
    </Avatar>
), {
    viewport: {
        defaultViewport: 'xs',
    },
})

stories.add('eth address', () => (
    <Avatar user={ethUser}>
        <Balance>
            <Balance.Account name="ETH" value="2.123" />
            <Balance.Account name="DATA" value="3.456" />
        </Balance>
    </Avatar>
))

stories.add('eth address (mobile)', () => (
    <Avatar user={ethUser}>
        <Balance>
            <Balance.Account name="ETH" value="2.123" />
            <Balance.Account name="DATA" value="3.456" />
        </Balance>
    </Avatar>
), {
    viewport: {
        defaultViewport: 'xs',
    },
})
