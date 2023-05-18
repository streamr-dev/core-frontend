import React from 'react'
import {Meta} from "@storybook/react"
import Balance, { Account } from '.'

export const Default = () => (
    <Balance>
        <Account name="ETH" value="2.123" />
        <Account name="DATA" value="3.456" />
    </Balance>
)

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Userpages/Balance',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            margin: '3rem',
        }}>
            <Story/>
        </div>
    }]
}

export default meta
