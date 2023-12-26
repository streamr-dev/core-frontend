import React from 'react'
import { Meta } from '@storybook/react'
import Spinner from '~/components/Spinner'
import { COLORS } from '~/shared/utils/styled'

export const SpinnerSmall = () => <Spinner />
SpinnerSmall.story = {
    name: 'small',
}

export const SpinnerLarge = () => <Spinner size="large" />
SpinnerLarge.story = {
    name: 'large',
}

export const SpinnerGreen = () => <Spinner />
SpinnerGreen.story = {
    name: 'green (default)',
}

export const SpinnerWhite = () => <Spinner color="white" />
SpinnerWhite.story = {
    name: 'white',
}

export const SpinnerBlue = () => <Spinner color="blue" />
SpinnerWhite.story = {
    name: 'blue',
}

export function ProgressSpinner25() {
    return <Spinner fixed coverage={0.25} />
}

ProgressSpinner25.story = {
    name: 'fixed with progress (25%)',
}

export function ProgressSpinner60() {
    return <Spinner fixed coverage={0.6} />
}

ProgressSpinner60.story = {
    name: 'fixed with progress (60%)',
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
