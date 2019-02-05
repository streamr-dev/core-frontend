import React from 'react'
import cx from 'classnames'

import ModuleSubscription from '../ModuleSubscription'

import TextInput from '../TextInput'
import styles from './TextField.pcss'

export default class TextFieldModule extends React.Component {
    state = {}

    static getDerivedStateFromProps(props) {
        if (props.isActive) { return null }
        return {
            value: props.module.textFieldValue,
        }
    }

    onChange = (textFieldValue) => {
        this.props.api.updateModule(this.props.moduleHash, { textFieldValue })
        this.setState({
            value: textFieldValue,
        })
    }

    onMessage = ({ state: textFieldValue }) => {
        this.setState({
            value: textFieldValue,
        })
    }

    componentDidMount() {
        if (this.props.isActive) {
            this.load()
        }
    }

    load = async () => {
        const { state } = await this.props.send({
            type: 'getState',
        })

        this.setState({
            value: state,
        })
    }

    onClick = async () => {
        this.props.send({
            type: 'uiEvent',
            value: this.state.value,
        })
    }

    render() {
        const { value } = this.state
        return (
            <div className={cx(this.props.className, styles.TextField)}>
                <ModuleSubscription isActive={this.props.isActive} onMessage={this.onMessage} />
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
                <button className={styles.button} onClick={this.onClick}>
                    Send
                </button>
            </div>
        )
    }
}
