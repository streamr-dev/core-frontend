import React from 'react'
import { Meta } from '@storybook/react'
import TextField from '~/shared/components/Ui/TextField'
import PopoverItem from '~/shared/components/Popover/PopoverItem'
import WithInputActions from './index'

export const Basic = () => (
    <WithInputActions actions={[<PopoverItem key="1">Some Action</PopoverItem>]}>
        <TextField />
    </WithInputActions>
)

Basic.story = {
    name: 'basic',
}

const meta: Meta<typeof Basic> = {
    title: 'Shared/WithInputActions',
    component: Basic,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '2rem',
                        color: 'black',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta

export const Disabled = () => (
    <WithInputActions actions={[<PopoverItem key="1">Some Action</PopoverItem>]} disabled>
        <TextField />
    </WithInputActions>
)

Disabled.story = {
    name: 'disabled',
}
