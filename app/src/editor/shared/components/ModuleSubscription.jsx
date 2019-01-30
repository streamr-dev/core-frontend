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
        if (this.state.error) { return } // do nothing if errored
        if (this.state.loading) { return } // do nothing if already loading
        return this.load()
    }

    async load() {
        this.setState(({ loading }) => ({
            loading: loading + 1, // start loading
        }))

        let res
        try {
            res = await this.send({ type: 'json' })
        } catch (error) {
            if (this.unmounted) { return }
            this.setState(({ loading }) => ({
                error,
                loading: Math.max(0, loading - 1), // end loading
            }))
            if (!this.props.onError) {
                throw error
            }
            this.props.onError(error)
            return
        }

        if (this.unmounted) { return }

        this.setState(({ loading }) => ({
            loading: Math.max(0, loading - 1), // end loading
            error: undefined,
            module: res.json,
        }))

        if (this.props.onLoad) {
            this.props.onLoad(res.json)
        }
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    state = {
        error: undefined,
        loading: 0,
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
