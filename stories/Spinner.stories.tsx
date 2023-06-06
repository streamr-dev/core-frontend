import React from 'react'
import { Meta } from '@storybook/react'
import Spinner from '$shared/components/Spinner'

export const SpinnerSmall = () => <Spinner size="small" />
SpinnerSmall.story = {
    name: 'small',
}

export const SpinnerLarge = () => <Spinner size="large" />
SpinnerLarge.story = {
    name: 'large',
}

export const SpinnerGreen = () => <Spinner color="green" />
SpinnerGreen.story = {
    name: 'green',
}

export const SpinnerWhite = () => <Spinner color="white" />
SpinnerWhite.story = {
    name: 'white',
}

const meta: Meta<typeof SpinnerSmall> = {
    title: 'Shared/Spinner',
    component: SpinnerSmall,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '15px',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}
export default meta
