import React from 'react'
import cx from 'classnames'

import CodeEditorWindow from '$editor/canvas/components/CodeEditorWindow'
import DebugWindow from '$editor/canvas/components/DebugWindow'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Custom.pcss'

const messages = []

export default class CustomModule extends React.Component {
    subscription = React.createRef()

    state = {
        editorOpen: false,
        debugOpen: false,
        debugMessages: messages,
        editorPosition: {
            x: 0,
            y: 0,
        },
        debugPosition: {
            x: 0,
            y: 0,
        },
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

    onApply = async (code) => {
        await this.props.api.pushNewDefinition(this.props.moduleHash, {
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

    onMessage = (d) => {
        if (d.type === 'debug') {
            this.setState(({ debugMessages }) => ({
                debugMessages: [
                    ...debugMessages,
                    {
                        msg: d.msg,
                        t: d.t,
                    },
                ],
            }))
        }
    }

    onClearDebug = () => {
        this.setState({
            debugMessages: [],
        })
    }

    onEditorPositionUpdate = (x, y) => {
        this.setState({
            editorPosition: {
                x,
                y,
            },
        })
    }

    onDebugPositionUpdate = (x, y) => {
        this.setState({
            debugPosition: {
                x,
                y,
            },
        })
    }

    render() {
        const { module, isActive } = this.props
        const {
            editorOpen,
            debugOpen,
            debugMessages,
            editorPosition,
            debugPosition,
        } = this.state

        return (
            <div className={cx(styles.CustomModule, this.props.className)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    onMessage={this.onMessage}
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
                        position={editorPosition}
                        onPositionUpdate={this.onEditorPositionUpdate}
                        code={module.code}
                        readOnly={isActive}
                        onClose={this.onCloseEditor}
                        onApply={this.onApply}
                        onShowDebug={this.onShowDebug}
                    />
                )}
                {!!debugOpen && (
                    <DebugWindow
                        onPositionUpdate={this.onDebugPositionUpdate}
                        position={debugPosition}
                        messages={debugMessages}
                        onClear={this.onClearDebug}
                        onClose={this.onCloseDebug}
                    />
                )}
            </div>
        )
    }
}

