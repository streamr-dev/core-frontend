import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'

import ButtonStyles from '$shared/components/Button/button.pcss'
import styles from './Button.pcss'

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
            <div className={cx(this.props.className, styles.Button)}>
                <ModuleSubscription
                    isActive={this.props.isActive}
                    onMessage={this.onMessage}
                />
                <button className={cx(styles.button, ButtonStyles.btn, ButtonStyles.btnPrimary)} onClick={this.onClick}>
                    {this.state.buttonName}
                </button>
            </div>
        )
    }
}

