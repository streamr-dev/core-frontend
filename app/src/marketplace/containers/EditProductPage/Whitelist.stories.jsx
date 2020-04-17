import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import WhitelistEditor from './WhitelistEditor'

const stories = storiesOf('Marketplace/ProductEditor/Whitelist', module)
    .addDecorator(styles({
        color: '#323232',
        padding: '16px',
        width: '680px',
    }))
    .addDecorator(withKnobs)

stories.add('basic', () => (
    <WhitelistEditor />
))
