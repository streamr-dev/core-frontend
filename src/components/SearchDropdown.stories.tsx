import React, { useState } from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { SearchDropdown } from '~/components/SearchDropdown'
import { COLORS } from '~/shared/utils/styled'

export const Default = () => {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <>
            <SearchDropdown
                name="testDropdown"
                onSelect={action('onSelect')}
                placeholder="Type to select a stream"
                value={''}
                isLoadingOptions={isLoading}
                onSearchInputChange={(searchInputValue) => {
                    setIsLoading(true)
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)
                    action('onSearchChange')(searchInputValue)
                }}
                options={[
                    { label: 'Option One', value: 'option_one_value' },
                    { label: 'Option Two', value: 'option_two_value' },
                ]}
            />
        </>
    )
}

const meta: Meta<typeof Default> = {
    title: 'Shared/SearchDropdown',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '40px',
                        maxWidth: '600px',
                        backgroundColor: 'lightgrey',
                        color: COLORS.primary,
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta
