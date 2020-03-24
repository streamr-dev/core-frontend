// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import NotificationList from '.'

const stories =
    storiesOf('shared/NotificationList', module)
        .addDecorator(withKnobs)

stories.add('default', () => (
    <NotificationList activities={[]} />
))
