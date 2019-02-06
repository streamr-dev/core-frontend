/* eslint-disable react/no-unused-state */

import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'

import TextInput from '../TextInput'
import styles from './TextField.pcss'

export default class TextFieldModule extends React.Component {
    state = {}

    subscription = React.createRef()

    onChange = (textFieldValue) => {
        this.props.api.updateModule(this.props.moduleHash, { textFieldValue })
    }

    onMessage = ({ state: textFieldValue }) => {
        this.setState({
            value: textFieldValue,
        })
    }

    onLoad = (res) => {
        this.setState({
            module: res.json,
        })
    }

    onClick = async () => {
        this.subscription.current.send({
            type: 'uiEvent',
            value: this.getValue(),
        })
    }

    getValue = () => {
        let { value } = this.state
        if (value == null) {
            // use module value unless state set
            const module = this.state.module || this.props.module
            value = module.textFieldValue
        }
        return value
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
        const { isActive } = this.props
        const value = this.getValue()
        return (
            <div className={cx(this.props.className, styles.TextField)}>
                <ModuleSubscription
                    {...this.props}
                    onMessage={this.onMessage}
                    onLoad={this.onLoad}
                    loadOptions={ModuleSubscription.loadJSON}
                    ref={this.subscription}
                    onActiveChange={this.onActiveChange}
                />
                <TextInput
                    value={value}
                    placeholder="Enter your text here"
                    onChange={this.onChange}
                    selectOnFocus={false}
                    blurOnEnterKey={false}
                >
                    {({ innerRef, ...props }) => (
                        <textarea ref={innerRef} {...props} />
                    )}
                </TextInput>
                <button type="button" className={styles.button} onClick={this.onClick} disabled={!isActive}>
                    Send
                </button>
            </div>
        )
    }
}
