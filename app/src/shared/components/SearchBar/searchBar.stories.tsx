import React from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import SearchBar from '.'

export const Default = () => <SearchBar onChange={action('inputChange')} />

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/SearchBar',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '2rem',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta

export const CustomPlaceholder = () => (
    <SearchBar
        placeholder={'Enter a phrase and try to search for something'}
        onChange={action('inputChange')}
    />
)

CustomPlaceholder.story = {
    name: 'custom placeholder',
}
