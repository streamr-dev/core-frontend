import React from 'react'
import cx from 'classnames'

import CodeEditorDialog from '$editor/canvas/components/CodeEditorDialog'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Custom.pcss'

export default class CustomModule extends React.Component {
    subscription = React.createRef()

    state = {
        editorOpen: false,
    }

    onEditCode = () => {
        this.setState({
            editorOpen: true,
        })
    }

    onClose = () => {
        this.setState({
            editorOpen: false,
        })
    }

    onApply = (code) => {
        this.props.api.updateModule(this.props.moduleHash, {
            code,
        })
    }

    render() {
        const { module } = this.props
        const { editorOpen } = this.state

        return (
            <div className={cx(styles.CustomModule, this.props.className)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                />
                <button
                    type="button"
                    className={styles.button}
                    onClick={this.onEditCode}
                >
                    Edit Code
                </button>
                {!!editorOpen && (
                    <CodeEditorDialog
                        code={module.code}
                        onClose={this.onClose}
                        onApply={this.onApply}
                    />
                )}
            </div>
        )
    }
}

