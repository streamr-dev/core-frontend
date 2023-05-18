import React from 'react'
import {Meta} from "@storybook/react"
import { WhiteBox } from '.'

export const Default = () => (
    <WhiteBox>
        <p>
            This is just a white box container with defined paddings for all breakpoints.
            Its purpose is to be used in the new HUB design
        </p>
    </WhiteBox>
)

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/WhiteBox',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            padding: '2rem',
            color: '#000',
            backgroundColor: '#ccc',
        }}>
            <Story/>
        </div>
    }]
}

export default meta
