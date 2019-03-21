import React from 'react'
import cx from 'classnames'

import CodeEditorWindow from '$editor/canvas/components/CodeEditorWindow'
import DebugWindow from '$editor/canvas/components/DebugWindow'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Custom.pcss'

export default class CustomModule extends React.Component {
    subscription = React.createRef()

    state = {
        editorOpen: false,
        debugOpen: false,
    }

    onShowEditor = () => {
        this.setState({
            editorOpen: true,
        })
    }

    onCloseEditor = () => {
        this.setState({
            editorOpen: false,
        })
    }

    onApply = (code) => {
        this.props.api.updateModule(this.props.moduleHash, {
            code,
        })
    }

    onShowDebug = () => {
        this.setState({
            debugOpen: true,
        })
    }

    onCloseDebug = () => {
        this.setState({
            debugOpen: false,
        })
    }

    render() {
        const { module } = this.props
        const { editorOpen, debugOpen } = this.state

        return (
            <div className={cx(styles.CustomModule, this.props.className)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                />
                <button
                    type="button"
                    className={styles.button}
                    onClick={this.onShowEditor}
                >
                    Edit Code
                </button>
                {!!editorOpen && (
                    <CodeEditorWindow
                        code={module.code}
                        onClose={this.onCloseEditor}
                        onApply={this.onApply}
                        onShowDebug={this.onShowDebug}
                    />
                )}
                {!!debugOpen && (
                    <DebugWindow
                        messages={[]}
                        onClose={this.onCloseDebug}
                    />
                )}
            </div>
        )
    }
}

