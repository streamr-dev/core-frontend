/* eslint-disable react/no-unused-state */

import React from 'react'

import { ClientContext } from './Subscription'

export default class ModuleLoader extends React.PureComponent {
    static contextType = ClientContext
    state = {}

    componentDidMount() {
        if (this.props.isActive) {
            this.load()
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isActive && this.props.isActive) {
            // always load when switching from inactive to active
            this.load()
        }

        if (prevProps.isActive && !this.props.isActive) {
            this.unload()
        }
    }

    unload = () => {
        this.setState({
            module: undefined,
        })
    }

    load = async () => {
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

        if (this.unmounted) { return }

        this.setState({
            module: res.json,
        })
    }

    componentWillUnmount() {
        this.unmounted = true
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
