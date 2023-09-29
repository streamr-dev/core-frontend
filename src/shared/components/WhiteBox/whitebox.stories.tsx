import React from 'react'
import { Meta } from '@storybook/react'
import { Separator } from '~/components/Separator'
import { WhiteBox } from './index'

export const Default = () => (
    <WhiteBox>
        <p>This is just a white box container with border radius</p>
    </WhiteBox>
)

export const WithPadding = () => (
    <WhiteBox className="with-padding">
        <p>
            This is just a white box container with defined paddings for all breakpoints.
            Its purpose is to be used in the new HUB design
        </p>
    </WhiteBox>
)

export const WithSeparator = () => (
    <WhiteBox>
        <p style={{ padding: '24px' }}>Lorem ipsum dolor sit amet.</p>
        <Separator />
        <p style={{ padding: '24px' }}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id, sed!
        </p>
    </WhiteBox>
)

const meta: Meta<typeof Default> = {
    title: 'Shared/WhiteBox',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '2rem',
                        color: '#000',
                        backgroundColor: '#ccc',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta
