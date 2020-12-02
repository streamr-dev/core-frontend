// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import AvatarImage from '../AvatarImage'

import AvatarCircle from '.'

const stories =
    storiesOf('Shared/AvatarCircle', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '3rem',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => (
    <AvatarCircle>
        <AvatarImage
            src="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg"
            name="Matt Innes"
        />
    </AvatarCircle>
))

stories.add('placeholder initials', () => (
    <AvatarCircle>
        <AvatarImage
            name="Matt Innes"
        />
    </AvatarCircle>
))

stories.add('placeholder address', () => (
    <AvatarCircle>
        <AvatarImage
            username="0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1"
        />
    </AvatarCircle>
))

stories.add('placeholder image', () => (
    <AvatarCircle>
        <AvatarImage />
    </AvatarCircle>
))

stories.add('placeholder image upload', () => (
    <AvatarCircle>
        <AvatarImage upload />
    </AvatarCircle>
))
