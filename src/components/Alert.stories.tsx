import React from 'react'
import { Meta } from '@storybook/react'
import { Alert } from './Alert'

export const Success = () => (
    <Alert title="Successfully deployed a contract!" type="success">
        <span>This is the content for the alert</span>
    </Alert>
)

export const Error = () => (
    <Alert title="Oh no! There was an error" type="error">
        <span>This is the content for the alert</span>
    </Alert>
)

export const Loading = () => (
    <Alert title="Wait while something is loading" type="loading">
        <span>This is the content for the alert</span>
    </Alert>
)

export const Notice = () => (
    <Alert title="Notice me!" type="notice">
        <span>This is the content for the alert</span>
    </Alert>
)

const meta: Meta<typeof Success> = {
    title: 'Shared/Alert',
    component: Success,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '2rem',
                        color: '#000',
                        backgroundColor: '#fff',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta
