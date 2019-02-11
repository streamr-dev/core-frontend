/* eslint-disable react/no-unused-state */
import React from 'react'
import { Input } from 'reactstrap'

export default class TextInput extends React.PureComponent {
    state = {
        value: '',
        hasFocus: false,
    }

    static defaultProps = {
        selectOnFocus: true,
        blurOnEnterKey: true,
        children(props) {
            return <Input {...props} />
        },
    }

    static getDerivedStateFromProps(props, state) {
        if (state.hasFocus) {
            return null // don't update while user is editing
        }

        return {
            value: props.value != null ? props.value : '',
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
        if (this.props.blurOnEnterKey) {
            // confirm changes on enter
            if (event.key === 'Enter' && this.el) {
                this.el.blur()
            }
        }
    }

    onFocus = (event) => {
        if (this.props.selectOnFocus) {
            event.target.select() // select all input text on focus
        }

        this.setState({
            hasFocus: true,
        })
        if (typeof this.props.onFocus === 'function') {
            this.props.onFocus(event)
        }
    }

    onBlur = (event) => {
        let { value } = this.state
        const { required } = this.props
        if (typeof value === 'string') {
            value = value.trim()
        }
        // only change if there's a value (if required) and it's different
        if (value !== this.props.value) {
            if (!required || (required && value)) {
                this.props.onChange(value)
            }
        }
        this.setState({
            hasFocus: false,
        })

        if (typeof this.props.onBlur === 'function') {
            this.props.onBlur(event)
        }
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
        const { selectOnFocus, blurOnEnterKey, children, ...props } = this.props
        return (
            children({
                ...props,
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
