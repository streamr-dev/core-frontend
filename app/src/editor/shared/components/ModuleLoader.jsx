/**
 * When isActive, loads module's runtime state from server.
 * Exposes a renderProp API.
 */

/* eslint-disable react/no-unused-state */

import EventEmitter from 'events'
import t from 'prop-types'
import React from 'react'

import { ClientContext } from './Client'

/**
 * Supplies default implementation of loadModule to ModuleLoader.
 * Separated from ModuleLoader so ModuleLoader core logic can be tested without magic mocks.
 */

export default class ModuleLoaderContainer extends React.PureComponent {
    static propTypes = {
        isActive: t.bool.isRequired,
        canvasId: t.string,
        dashboardId: t.string,
    }

    static contextType = ClientContext

    loadModule = async () => {
        const { canvasId, dashboardId, moduleHash } = this.props

        const data = {
            type: 'json',
        }

        const res = await this.context.send({
            data,
            canvasId,
            dashboardId,
            moduleHash,
        })

        return res.json
    }

    render() {
        return <ModuleLoader loadModule={this.loadModule} {...this.props} />
    }
}

export class UiEmitter {
    emitter = new EventEmitter()

    subscribe(handler) {
        this.emitter.on('reload', handler)
    }

    unsubscribe(handler) {
        this.emitter.removeListener('reload', handler)
    }

    reload() {
        this.emitter.emit('reload')
    }
}

export class ModuleLoader extends React.PureComponent {
    static propTypes = {
        isActive: t.bool.isRequired,
        loadModule: t.func.isRequired,
        uiEmitter: t.instanceOf(UiEmitter),
    }

    state = {
        module: undefined,
        loading: false,
    }

    componentDidMount() {
        if (this.props.uiEmitter) {
            this.props.uiEmitter.subscribe(this.loadModule)
        }

        if (this.props.isActive) {
            return this.loadModule()
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isActive && this.props.isActive) {
            // always load when switching from inactive to active
            return this.loadModule()
        }

        if (prevProps.isActive && !this.props.isActive) {
            return this.unload()
        }
    }

    unload = () => {
        this.setState({
            module: undefined,
        })
    }

    loadModule = () => {
        if (this.unmounted || this.state.loading) { return }
        this.setState({
            loading: true,
        }, async () => {
            const module = await this.props.loadModule()
            if (this.unmounted) { return }

            this.setState({
                module,
                loading: false,
            })
        })
    }

    componentWillUnmount() {
        this.unmounted = true

        if (this.uiEmitter) {
            this.props.uiEmitter.unsubscribe(this.onReload)
        }
    }

    render() {
        const { children, ...props } = this.props
        const module = this.state.module || this.props.module
        return (
            children({
                ...props,
                module,
            })
        )
    }
}
