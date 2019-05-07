import React from 'react'
import cx from 'classnames'

import UiSizeConstraint from '../UiSizeConstraint'
import TextControl from '$shared/components/TextControl'
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
            <UiSizeConstraint minWidth={100} minHeight={50}>
                <div className={cx(this.props.className, styles.Comment)}>
                    <TextControl
                        commitEmpty
                        flushHistoryOnBlur
                        onCommit={this.onChange}
                        placeholder="Enter comment here…"
                        tag="textarea"
                        value={this.getValue()}
                    />
                </div>
            </UiSizeConstraint>
        )
    }
}
