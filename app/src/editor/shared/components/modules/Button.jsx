import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'

import ButtonStyles from '$shared/components/Button/button.pcss'
import styles from './Button.pcss'

function getModuleButtonName(module) {
    const param = module.params.find((p) => p.name === 'buttonName')
    return param.value || param.defaultValue
}

export default class ButtonModule extends React.Component {
    subscription = React.createRef()

    state = {
        value: undefined,
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

    getValue = () => {
        let { value } = this.state
        if (value == null) {
            // use module value unless state set
            value = getModuleButtonName(this.props.module)
        }

        return value
    }

    onActiveChange = (isActive) => {
        if (!isActive) {
            this.setState({
                value: undefined,
            })
        }
    }

    render() {
        return (
            <div className={cx(this.props.className, styles.Button)}>
                <ModuleSubscription
                    {...this.props}
                    onLoad={this.onLoad}
                    loadOptions={{ type: 'getState' }}
                    onMessage={this.onMessage}
                    onActiveChange={this.onActiveChange}
                    ref={this.subscription}
                />
                <button className={cx(styles.button, ButtonStyles.btn, ButtonStyles.btnPrimary)} onClick={this.onClick}>
                    {this.getValue()}
                </button>
            </div>
        )
    }
}

