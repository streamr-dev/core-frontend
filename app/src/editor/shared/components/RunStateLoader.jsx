/**
 * When isActive, loads module's runtime state from server.
 * Exposes a renderProp API.
 */

/* eslint-disable react/no-unused-state */

import EventEmitter from 'events'
import t from 'prop-types'
import React from 'react'

import { Context as ClientContext } from '$shared/contexts/StreamrClient'
import * as services from '$editor/shared/services'

/**
 * Supplies default implementation of loadRunState to RunStateLoader.
 * Separated from RunStateLoader so RunStateLoader core logic can be tested without magic mocks.
 */

export default class RunStateLoaderContainer extends React.PureComponent {
    static propTypes = {
        isActive: t.bool.isRequired,
        canvasId: t.string,
        dashboardId: t.string,
    }

    static contextType = ClientContext

    loadRunState = async () => {
        const { canvasId, dashboardId, moduleHash, canvas } = this.props

        // no load for adhoc canvases
        if (canvas && canvas.adhoc) { return }

        const data = {
            type: 'json',
        }

        const { apiKey } = this.context
        const res = await services.send({
            apiKey,
            data,
            canvasId,
            dashboardId,
            moduleHash,
        })

        return res.json
    }

    render() {
        return <RunStateLoader loadRunState={this.loadRunState} {...this.props} />
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

// RunStateLoader loads the (initial) run state of a module.
// It can also reload the data on request.
export class RunStateLoader extends React.PureComponent {
    static propTypes = {
        isActive: t.bool.isRequired,
        loadRunState: t.func.isRequired,
        uiEmitter: t.instanceOf(UiEmitter),
    }

    state = {
        module: undefined,
        loading: false,
    }

    componentDidMount() {
        if (this.props.uiEmitter) {
            this.props.uiEmitter.subscribe(this.loadRunState)
        }

        if (this.props.isActive) {
            return this.loadRunState()
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isActive && this.props.isActive) {
            // always load when switching from inactive to active
            return this.loadRunState()
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

    loadRunState = () => {
        if (this.unmounted || this.state.loading) { return }
        this.setState({
            loading: true,
        }, async () => {
            const module = await this.props.loadRunState()
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
