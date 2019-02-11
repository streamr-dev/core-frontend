/**
 *  Double-click to edit text value.
 */

import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'

import TextInput from './TextInput'
import styles from './RenameInput.pcss'

/* eslint-disable react/no-unused-state */

export default class RenameInput extends React.PureComponent {
    onInnerRef = (el) => {
        this.el = el
        if (this.props.innerRef) {
            this.props.innerRef(el)
        }
    }

    render() {
        const { className, inputClassName, ...props } = this.props
        const PADDING = 2 // add some padding to ensure text isn't cut off :/
        return (
            <div className={cx(styles.RenameInputContainer, className)} onDoubleClick={() => this.el.focus()}>
                <TextInput {...props} innerRef={this.onInnerRef}>
                    {(props) => (
                        <R.Input
                            {...props}
                            className={cx(styles.RenameInput, inputClassName)}
                            size={props.value.length ? String(props.value.length + PADDING) : undefined}
                        />
                    )}
                </TextInput>
            </div>
        )
    }
}
