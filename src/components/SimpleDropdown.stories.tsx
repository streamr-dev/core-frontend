import React from 'react'
import { Meta } from '@storybook/react'
import { DefaultSimpleDropdownMenu, SimpleDropdown } from '~/components/SimpleDropdown'

export const Basic = () => (
    <div>
        <p>
            A simple dropdown in which you can provide the component that will work as a
            Toogle
        </p>
        <SimpleDropdown
            menu={<DefaultSimpleDropdownMenu>Content</DefaultSimpleDropdownMenu>}
        >
            {(toggle, isOpen) => (
                <button type="button" onClick={() => void toggle((c) => !c)}>
                    Button as trigger (click to {isOpen ? 'close' : 'open'})
                </button>
            )}
        </SimpleDropdown>
        <SimpleDropdown
            menu={<DefaultSimpleDropdownMenu>Content</DefaultSimpleDropdownMenu>}
        >
            {(toggle, isOpen) => (
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault()

                        toggle((c) => !c)
                    }}
                >
                    Link as trigger (click to {isOpen ? 'close' : 'open'})
                </a>
            )}
        </SimpleDropdown>
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
