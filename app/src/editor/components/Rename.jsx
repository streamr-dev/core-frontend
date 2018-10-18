/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'

import styles from './Rename.pcss'

export default class Rename extends React.Component {
    state = {
        value: '',
        hasFocus: false,
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
        const value = this.state.value.trim()
        // only rename if there's a value and it's different
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
            <div className={cx(styles.RenameContainer)} onDoubleClick={() => this.el.focus()}>
                <R.Input
                    className={cx(styles.Rename, this.props.className)}
                    innerRef={this.onInnerRef}
                    value={this.state.value}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                />
            </div>
        )
    }
}
