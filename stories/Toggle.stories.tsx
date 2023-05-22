import {Meta} from "@storybook/react"
import {action} from "@storybook/addon-actions"
import React from "react"
import Toggle from "$shared/components/Toggle"

class ToggleContainer extends React.Component {
    state = {
        value: false,
    }

    render() {
        return (
            <Toggle
                value={this.state.value}
                onChange={(value) => {
                    this.setState({
                        value,
                    })
                    action('onChange')(value)
                }}
            />
        )
    }
}

export const ToggleContainerChangeable = () => <ToggleContainer />
ToggleContainerChangeable.story = {
    name: 'changeable',
}

const meta: Meta<typeof ToggleContainerChangeable> = {
    title: 'Shared/Toggle',
    component: ToggleContainerChangeable,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '15px',
        }}>
            <Story/>
        </div>
    }]
}
export default meta

export const ToggleContainerOff = () => <Toggle value={false} onChange={action('onChange')} />
ToggleContainerOff.story = {
    name: 'off'
}

export const ToggleContainerOn = () => <Toggle value={true} onChange={action('onChange')} />
ToggleContainerOn.story = {
    name: 'on'
}
