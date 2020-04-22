import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { withKnobs } from '@storybook/addon-knobs'

import WhitelistEditorComponent from './WhitelistEditor'

const stories = storiesOf('Marketplace/ProductEditor/Whitelist', module)
    .addDecorator(styles({
        color: '#323232',
        margin: '16px',
        width: '680px',
    }))
    .addDecorator(withKnobs)

stories.add('basic', () => {
    const items = [
        {
            name: 'Test 1',
            address: '0x123123213234234231',
            status: 'added',
        },
        {
            name: 'Test 2',
            address: '0x123123223423231',
            status: 'added',
        },
        {
            name: 'Test 3',
            address: '0x12312342342342413231',
            status: 'removed',
        },
        {
            name: 'Test 4',
            address: '0x12323444444231',
            status: 'subscribed',
        },
    ]

    return (
        <WhitelistEditorComponent enabled items={items} />
    )
})
