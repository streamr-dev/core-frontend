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

    onChange = (code) => {
        this.props.api.updateModule(this.props.moduleHash, { code })
    }

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
        const { module, isEditable } = this.props
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
                    readOnly={!isEditable}
                    onApply={this.onApply}
                    onChange={this.onChange}
                    debugMessages={debugMessages}
                    onClearDebug={this.onClearDebug}
                >
                    {(openEditor) => (
                        <div className={styles.buttonsContainer}>
                            <button
                                type="button"
                                className={styles.button}
                                onClick={openEditor}
                            >
                                Edit code
                            </button>
                            <button
                                type="button"
                                className={styles.button}
                                onClick={this.onDeploy}
                                disabled={!isEditable || (contract && (contract.address || deploying))}
                            >
                                {(!contract || (contract && !contract.address)) && !deploying && (
                                    'Deploy'
                                )}
                                {(!contract || (contract && !contract.address)) && deploying && (
                                    <Spinner size="small" className={styles.spinner} />
                                )}
                                {contract && contract.address && (
                                    'Deployed'
                                )}
                            </button>
                        </div>
                    )}
                </CodeEditor>
                {contract && contract.address && (
                    <div>
                        <div className={styles.address}>
                            <div className={styles.addressLabel}>Address</div>
                            <div
                                className={styles.addressValue}
                                data-truncated={contract.address.substring(contract.address.length - 6)}
                                title={contract.address}
                            >
                                <div>{contract.address}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

