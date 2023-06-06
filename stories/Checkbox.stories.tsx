import { Meta } from '@storybook/react'
import React from 'react'
import { action } from '@storybook/addon-actions'
import Checkbox from '$shared/components/Checkbox'

class CheckboxContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
        }
    }

    render() {
        return (
            <Checkbox
                value={this.state.checked}
                onChange={(e) => {
                    this.setState({
                        checked: e.target.checked,
                    })
                    action('checked')(e)
                }}
            />
        )
    }
}

export const CheckboxChecked = () => <Checkbox value={true} />
CheckboxChecked.story = {
    name: 'checked',
}

export const CheckboxUnchecked = () => <Checkbox value={false} />
CheckboxUnchecked.story = {
    name: 'unchecked',
}

export const CheckboxChangeable = () => <CheckboxContainer />
CheckboxChangeable.story = {
    name: 'changeable',
}

const meta: Meta<typeof CheckboxChecked> = {
    title: 'Shared/Checkbox',
    component: CheckboxChecked,
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
