/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'
import TextInput from './TextInput'
import styles from './RenameInput.pcss'

export default class RenameInput extends React.PureComponent {
    onInnerRef = (el) => {
        this.el = el
        if (this.props.innerRef) {
            this.props.innerRef(el)
        }
    }

    render() {
        const { className, ...props } = this.props
        return (
            <div className={cx(styles.RenameInputContainer, className)} onDoubleClick={() => this.el.focus()}>
                <TextInput {...props} innerRef={this.onInnerRef}>
                    {(props) => (
                        <R.Input
                            {...props}
                            className={cx(styles.RenameInput)}
                        />
                    )}
                </TextInput>
            </div>
        )
    }
}
