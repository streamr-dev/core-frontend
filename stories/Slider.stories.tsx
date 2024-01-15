import React from 'react'
import { Meta } from '@storybook/react'
import { Slider } from '~/components/Slider'

class SliderContainer extends React.Component {
    state = {
        sliderValue: 1,
    }
    onChange = (value) => {
        this.setState({
            sliderValue: value,
        })
    }

    render() {
        return (
            <div>
                <Slider
                    min={1}
                    max={100}
                    value={this.state.sliderValue}
                    onChange={this.onChange}
                />
                <div
                    style={{
                        color: '#323232',
                    }}
                >
                    Slider value: {this.state.sliderValue}
                </div>
            </div>
        )
    }
}

export const Basic = () => <SliderContainer />
Basic.story = {
    name: 'basic',
}

const meta: Meta<typeof Basic> = {
    title: 'Shared/Slider',
    component: Basic,
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
