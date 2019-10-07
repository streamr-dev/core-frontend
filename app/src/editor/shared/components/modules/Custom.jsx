import React from 'react'
import cx from 'classnames'

import CodeEditor from '$editor/canvas/components/CodeEditor'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Custom.pcss'

export default class CustomModule extends React.Component {
    subscription = React.createRef()

    state = {
        debugMessages: [],
    }

    onApply = async (code) => (
        this.props.api.pushNewDefinition(this.props.moduleHash, {
            code,
        })
    )

    onChange = (code) => {
        this.props.api.updateModule(this.props.moduleHash, { code })
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

    render() {
        const { module, isEditable } = this.props
        const { debugMessages } = this.state

        return (
            <div className={cx(styles.CustomModule, this.props.className)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    onMessage={this.onMessage}
                />
                <CodeEditor
                    code={module.code || ''}
                    readOnly={!isEditable}
                    onApply={this.onApply}
                    onChange={this.onChange}
                    debugMessages={debugMessages}
                    onClearDebug={this.onClearDebug}
                >
                    {(showEditor) => (
                        <button
                            type="button"
                            className={styles.button}
                            onClick={showEditor}
                        >
                            Edit Code
                        </button>
                    )}
                </CodeEditor>
            </div>
        )
    }
}

