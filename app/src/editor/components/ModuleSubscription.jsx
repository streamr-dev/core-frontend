/* eslint-disable react/no-unused-state */

import React from 'react'

import * as services from '../services'

import Subscription from './Subscription'

const ModuleContext = React.createContext()

export class ModuleLoader extends React.PureComponent {
    static Context = ModuleContext

    componentDidMount() {
        this.loadIfNeeded()
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isActive && this.props.isActive) {
            // always load when switching from inactive to active
            this.load()
        } else {
            this.loadIfNeeded()
        }
    }

    send = async (data) => {
        const { canvasId, dashboardId, moduleHash } = this.props
        return services.send({
            data,
            canvasId,
            dashboardId,
            moduleHash,
        })
    }

    async loadIfNeeded() {
        if (!this.props.isActive) { return } // do nothing if not active
        if (this.state.module) { return } // do nothing if already loaded
        return this.load()
    }

    async load() {
        const { json } = await this.send({ type: 'json' })
        this.setState({ module: json })
    }

    state = {
        module: undefined,
        send: this.send,
    }

    render() {
        return (
            <ModuleContext.Provider value={this.state}>
                {this.props.children || null}
            </ModuleContext.Provider>
        )
    }
}

export default class ModuleSubscription extends React.PureComponent {
    static contextType = ModuleContext
    render() {
        const { module } = this.context
        if (!module) { return null }
        const { options = {} } = module
        return (
            <Subscription
                {...this.props}
                uiChannel={module.uiChannel}
                resendAll={options.uiResendAll && options.uiResendAll.value}
                resendLast={options.uiResendLast && options.uiResendLast.value}
                resendFrom={options.uiResendFrom && options.uiResendFrom.value}
                resendFromTime={options.uiResendFromTime && options.uiResendFromTime.value}
            />
        )
    }
}
