// @flow

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import { withKnobs } from '@storybook/addon-knobs'

import { WhitelistEditorComponent } from './WhitelistEditor'

const stories = storiesOf('Marketplace/ProductEditor/Whitelist', module)
    .addDecorator(styles({
        color: '#323232',
        margin: '16px',
        width: '680px',
    }))
    .addDecorator(withKnobs)

type Props = {
    items: Array<any>,
}

const WhiteListEditor = ({ items }: Props) => {
    const [isEnabled, setIsEnabled] = useState(true)

    return (
        <WhitelistEditorComponent
            enabled={isEnabled}
            items={items}
            onEnableChanged={(val) => setIsEnabled(val)}
            addDialog={null}
            removeDialog={null}
            copy={action('Copy')}
        />
    )
}

stories.add('short', () => {
    const items = [
        {
            name: 'Test 1',
            address: '0x123123213234234231',
            status: 'added',
        },
    ]

    return (
        <WhiteListEditor items={items} />
    )
})

stories.add('long', () => {
    const items = [
        {
            name: 'Test 1',
            address: '0x123123213234234231',
            status: 'added',
        },
        {
            name: 'Test 2',
            address: '0x123123223423231232',
            status: 'subscribed',
        },
        {
            name: 'Test 3',
            address: '0x123123423423424132',
            status: 'removed',
        },
        {
            name: 'Test 4',
            address: '0x919921123123333123',
            status: 'subscribed',
        },
        {
            name: 'Test 5',
            address: '0x999123912939123912',
            status: 'subscribed',
        },
        {
            name: 'Test 6',
            address: '0xDEADBEEFDEADBEEFEF',
            status: 'removed',
        },
        {
            name: 'Test 7',
            address: '0x991919191818189182',
            status: 'added',
        },
    ]

    return (
        <WhiteListEditor items={items} />
    )
})
