import React from 'react'
import { Meta } from '@storybook/react'
import Text from '~/shared/components/Ui/Text'
import { PopoverItem } from '~/components/Popover'
import WithInputActions from './WithInputActions'

export const Basic = () => (
    <WithInputActions actions={[<PopoverItem key="1">Some Action</PopoverItem>]}>
        <Text />
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
        <Text />
    </WithInputActions>
)

Disabled.story = {
    name: 'disabled',
}
