import React from 'react'
import { Meta } from '@storybook/react'
import { SimpleDropdown } from '~/components/SimpleDropdown'

export const Basic = () => (
    <div>
        <p>
            A simple dropdown in which you can provide the component that will work as a
            Toogle
        </p>
        <SimpleDropdown
            toggleElement={<button>Button as trigger</button>}
            dropdownContent={<div>Content</div>}
        />
        <SimpleDropdown
            toggleElement={
                <p style={{ backgroundColor: 'lightblue' }}>Paragraph as trigger</p>
            }
            dropdownContent={<div>Content</div>}
        />
    </div>
)

Basic.story = {
    name: 'basic',
}

const meta: Meta<typeof Basic> = {
    title: 'Shared/SimpleDropdown',
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
