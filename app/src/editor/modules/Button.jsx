import React from 'react'

import ModuleSubscription from '../components/ModuleSubscription'

export default class ButtonModule extends React.Component {
    state = {
        buttonName: 'Button',
    }

    componentDidMount() {
        this.load()
    }

    load = async () => {
        const { state } = await this.props.send({
            type: 'getState',
        })
        this.setName(state)
    }

    setName = (buttonName = '') => {
        if (buttonName == null) { return }
        this.setState({
            buttonName: buttonName || '',
        })
    }

    onMessage = ({ buttonName }) => {
        this.setName(buttonName)
    }

    onClick = async () => {
        this.props.send({
            type: 'uiEvent',
            value: '',
        })
    }

    render() {
        return (
            <div className={this.props.className}>
                <ModuleSubscription
                    isActive={this.props.isActive}
                    onMessage={this.onMessage}
                />
                <button onClick={this.onClick}>
                    {this.state.buttonName}
                </button>
            </div>
        )
    }
}

