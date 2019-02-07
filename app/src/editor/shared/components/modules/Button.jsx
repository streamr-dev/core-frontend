import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'

import ButtonStyles from '$shared/components/Button/button.pcss'
import styles from './Button.pcss'

export default class ButtonModule extends React.Component {
    subscription = React.createRef()

    state = {
        value: 'Button',
    }

    onLoad = async ({ state }) => {
        this.setName(state)
    }

    setName = (buttonName = '') => {
        if (buttonName == null) { return }
        this.setState({
            value: buttonName || '',
        })
    }

    onMessage = ({ buttonName }) => {
        this.setName(buttonName)
    }

    onClick = async () => {
        this.subscription.current.send({
            type: 'uiEvent',
            value: '',
        })
    }

    render() {
        return (
            <div className={cx(this.props.className, styles.Button)}>
                <ModuleSubscription
                    {...this.props}
                    onLoad={this.onLoad}
                    loadOptions={ModuleSubscription.loadGetState}
                    ref={this.subscription}
                />
                <button className={cx(styles.button, ButtonStyles.btn, ButtonStyles.btnPrimary)} onClick={this.onClick}>
                    {this.state.value}
                </button>
            </div>
        )
    }
}

