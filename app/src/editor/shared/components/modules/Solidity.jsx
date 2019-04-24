import React from 'react'
import cx from 'classnames'

import CodeEditor from '$editor/canvas/components/CodeEditor'
import Spinner from '$shared/components/Spinner'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Solidity.pcss'

export default class SolidityModule extends React.Component {
    subscription = React.createRef()

    state = {
        debugMessages: [],
        deploying: false,
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    onApply = async (code) => (
        this.props.api.pushNewDefinition(this.props.moduleHash, {
            code,
            compile: true,
        })
    )

    onDeploy = () => {
        if (!this.state.deploying) {
            this.setState({
                deploying: true,
            }, () => {
                this.props.api.pushNewDefinition(this.props.moduleHash, {
                    deploy: true,
                })
                    .finally(() => {
                        if (this.unmounted) { return }
                        this.setState({
                            deploying: false,
                        })
                    })
            })
        }
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
        const { module, isActive } = this.props
        const { debugMessages, deploying } = this.state
        const { contract } = module

        return (
            <div className={cx(styles.SolidityModule, this.props.className)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    onMessage={this.onMessage}
                />
                <CodeEditor
                    code={module.code || ''}
                    readOnly={isActive}
                    onApply={this.onApply}
                    debugMessages={debugMessages}
                    onClearDebug={this.onClearDebug}
                />
                {contract && contract.address && (
                    <div className={styles.address}>
                        0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10
                    </div>
                )}
                {contract && !contract.address && deploying && (
                    <div className={styles.spinner}>
                        <Spinner size="small" />
                    </div>
                )}
                {contract && !contract.address && !deploying && (
                    <button
                        type="button"
                        className={styles.button}
                        onClick={this.onDeploy}
                    >
                        Deploy
                    </button>
                )}
            </div>
        )
    }
}

