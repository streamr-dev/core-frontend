/* eslint-disable react/no-unused-state */
import React from 'react'
import { Input } from 'reactstrap'

export default class TextInput extends React.PureComponent {
    state = {
        value: '',
        hasFocus: false,
    }

    static defaultProps = {
        children(props) {
            return <Input {...props} />
        },
    }

    static getDerivedStateFromProps(props, state) {
        if (state.hasFocus) {
            return null // don't update while user is editing
        }

        return {
            value: props.value,
        }
    }

    onKeyDown = (event) => {
        // reset to previous on esc
        if (event.key === 'Escape' && this.el) {
            this.setState({
                value: this.props.value,
            }, () => {
                this.el.blur()
            })
        }

        // confirm on enter
        if (event.key === 'Enter' && this.el) {
            this.el.blur()
        }
    }

    onFocus = (event) => {
        event.target.select() // select all input text on focus

        this.setState({
            hasFocus: true,
        })
    }

    onBlur = () => {
        let { value } = this.state
        if (typeof value === 'string') {
            value = value.trim()
        }
        // only change if there's a value and it's different
        if (value && value !== this.props.value) {
            this.props.onChange(value)
        }
        this.setState({
            hasFocus: false,
        })
    }

    onChange = (event) => {
        const { value } = event.target
        this.setState({ value })
    }

    onInnerRef = (el) => {
        this.el = el
        if (this.props.innerRef) {
            this.props.innerRef(el)
        }
    }

    render() {
        return (
            this.props.children({
                ...this.props,
                children: undefined,
                innerRef: this.onInnerRef,
                value: this.state.value,
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                onChange: this.onChange,
                onKeyDown: this.onKeyDown,
            })
        )
    }
}
