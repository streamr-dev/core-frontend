import React from 'react'
import cx from 'classnames'

import TextInput from '../TextInput'
import styles from './Comment.pcss'

export default class CommentModule extends React.PureComponent {
    state = {}
    onChange = (text) => {
        if (!this.props.isActive) {
            this.props.api.updateModule(this.props.moduleHash, { text })
        } else {
            this.setState({
                value: text,
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isActive && !this.props.isActive) {
            this.clear()
        }
    }

    clear() {
        this.setState({
            value: undefined,
        })
    }

    getValue = () => {
        let { value } = this.state
        if (value == null) {
            // use module value unless state set
            const { module } = this.props
            value = module.text
        }
        return value
    }

    render() {
        return (
            <div className={cx(this.props.className, styles.Comment)}>
                <TextInput
                    value={this.getValue()}
                    placeholder="Enter comment here"
                    onChange={this.onChange}
                    selectOnFocus={false}
                    blurOnEnterKey={false}
                >
                    {({ innerRef, ...props }, { hasFocus }) => (
                        <textarea
                            key={hasFocus}
                            ref={innerRef}
                            {...props}
                        />
                    )}
                </TextInput>
            </div>
        )
    }
}
