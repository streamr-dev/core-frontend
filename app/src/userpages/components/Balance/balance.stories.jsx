// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import Balance from '.'

const stories =
    storiesOf('Userpages/Balance', module)
        .addDecorator(styles({
            margin: '3rem',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => (
    <Balance>
        <Balance.Account name="ETH" value="2.123" />
        <Balance.Account name="DATA" value="3.456" />
    </Balance>
))
