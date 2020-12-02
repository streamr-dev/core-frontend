// @flow

import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import AvatarImage from '.'

const stories =
    storiesOf('Shared/AvatarImage', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '3rem',
        }))
        .addDecorator(withKnobs)

const Container = styled.div`
    width: 200px;
    height: 200px;
    border: 1px solid #EFEFEF;
`

stories.add('default', () => (
    <Container>
        <AvatarImage
            src="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg"
            name="Matt Innes"
        />
    </Container>
))

stories.add('placeholder initials', () => (
    <Container>
        <AvatarImage
            name="Matt Innes"
        />
    </Container>
))

stories.add('placeholder address', () => (
    <Container>
        <AvatarImage
            username="0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1"
        />
    </Container>
))

stories.add('placeholder image', () => (
    <Container>
        <AvatarImage />
    </Container>
))

stories.add('placeholder image upload', () => (
    <Container>
        <AvatarImage upload />
    </Container>
))
