import React from 'react'
import cx from 'classnames'

import Toggle from '$shared/components/Toggle'
import ModuleSubscription from '../ModuleSubscription'
import styles from './Switcher.pcss'

export default class SwitcherModule extends React.Component {
    subscription = React.createRef()

    state = {}

    getValue = () => {
        let { value } = this.state
        if (value == null) {
            // use module value unless state set
            const module = this.state.module || this.props.module
            value = module.switcherValue
        }
        return value
    }

    onMessage = ({ value }) => {
        this.setState({
            value,
        })
    }

    onChange = async (value) => {
        if (this.props.isActive) {
            this.subscription.current.send({
                type: 'uiEvent',
                value,
            })
        }

        this.props.api.updateModule(this.props.moduleHash, {
            switcherValue: value,
        })
    }

    onActiveChange = (isActive) => {
        if (isActive) {
            this.subscription.current.send({
                type: 'uiEvent',
                value: this.getValue(),
            })
        } else {
            this.setState({
                value: undefined,
            })
        }
    }

    render() {
        const { className } = this.props
        const value = this.getValue()

        return (
            <div className={cx(styles.Switcher, className)}>
                <ModuleSubscription
                    {...this.props}
                    onMessage={this.onMessage}
                    ref={this.subscription}
                    loadOptions={ModuleSubscription.getState}
                    onActiveChange={this.onActiveChange}
                />
                <Toggle
                    key={this.props.module.switcherValue}
                    value={value}
                    onChange={this.onChange}
                />
            </div>
        )
    }
}
