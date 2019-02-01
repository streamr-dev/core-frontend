import React from 'react'
import cx from 'classnames'

import TextInput from '../TextInput'
import styles from './Comment.pcss'

export default class CommentModule extends React.Component {
    onChange = (text) => {
        this.props.api.updateModule(this.props.moduleHash, { text })
    }

    render() {
        const { module } = this.props
        return (
            <div className={cx(this.props.className, styles.Comment)}>
                <TextInput
                    value={module.text}
                    placeholder="Enter comment here"
                    onChange={this.onChange}
                    selectOnFocus={false}
                    blurOnEnterKey={false}
                >
                    {({ innerRef, ...props }) => (
                        <textarea ref={innerRef} {...props} />
                    )}
                </TextInput>
            </div>
        )
    }
}
