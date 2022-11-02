import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import Balance, { Account } from '.'

const stories = storiesOf('Userpages/Balance', module)
    .addDecorator(
        styles({
            margin: '3rem',
        }),
    )

stories.add('default', () => (
    <Balance>
        <Account name="ETH" value="2.123" />
        <Account name="DATA" value="3.456" />
    </Balance>
))
