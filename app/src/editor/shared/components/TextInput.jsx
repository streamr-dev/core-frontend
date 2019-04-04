/**
 * Stored edited state locally.
 * Fires onChange on blur.
 */

import React from 'react'
import { Input } from 'reactstrap'

/* eslint-disable react/no-unused-state */
export default class TextInput extends React.PureComponent {
    state = {
        value: '',
        hasFocus: false,
    }

    static defaultProps = {
        selectOnFocus: true, // select all input text on focus
        blurOnEnterKey: true, // allow committing with enter key. No good for textareas.
        // render Input by default, otherwise exposes render-prop API.
        children: (props) => <Input {...props} />,
    }

    static getDerivedStateFromProps({ value }, { hasFocus }) {
        if (hasFocus) {
            return null // don't update if changes arrive while user is editing
        }

        return {
            // undefined/null value is not valid
            value: value != null ? value : '',
        }
    }

    onKeyDown = (event) => {
        const { value, blurOnEnterKey } = this.props
        // reset to passed-in value on esc
        // TODO: consider using value at start of edit vs props.value, which may have changed
        if (event.key === 'Escape' && this.el) {
            this.setState({
                value,
            }, () => {
                // trigger blur *after* setting value
                // so blur handler sees changed value
                this.el.blur()
            })
        }

        // commit changes on enter
        if (blurOnEnterKey) {
            if (event.key === 'Enter' && this.el) {
                this.el.blur()
            }
        }
    }

    onFocus = (event) => {
        const { selectOnFocus, onFocus } = this.props

        // select all input text on focus
        if (selectOnFocus) {
            event.target.select()
        }

        this.setState({
            hasFocus: true,
        })

        if (typeof onFocus === 'function') {
            onFocus(event)
        }
    }

    onBlur = (event) => {
        const { required, value: newValue, onChange, onBlur } = this.props
        let { value } = this.state

        // normalise value
        if (typeof value === 'string') {
            value = value.trim()
        } else {
            value = String(value)
        }

        // only change if there's a value (if required) and it's different
        if (String(value).trim() !== String(newValue).trim()) {
            if (!required || (required && value)) {
                onChange(value)
            }
        }

        this.setState({
            hasFocus: false,
        })

        if (typeof onBlur === 'function') {
            onBlur(event)
        }
    }

    onChange = (event) => {
        const { value } = event.target
        this.setState({ value })
    }

    render() {
        const { selectOnFocus, blurOnEnterKey, children, ...props } = this.props
        return (
            children({
                ...props,
                value: this.state.value,
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                onChange: this.onChange,
                onKeyDown: this.onKeyDown,
            }, this.state)
        )
    }
}
