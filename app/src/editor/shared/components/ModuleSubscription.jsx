/* eslint-disable react/no-unused-state */

import React from 'react'

import Subscription from './Subscription'
import { ClientContext } from './Client'

export default class ModuleSubscription extends React.PureComponent {
    static contextType = ClientContext

    static loadGetState = {
        type: 'getState',
    }

    static loadJSON = {
        type: 'json',
    }

    send = async (data) => {
        if (this.unmounted) { return }
        if (!this.props.isActive) { return } // do nothing if not active
        const { canvasId, dashboardId, moduleHash } = this.props
        return this.context.send({
            data,
            canvasId,
            dashboardId,
            moduleHash,
        })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isActive && this.props.isActive) {
            // always load when switching from inactive to active
            this.load()
            if (this.props.onActiveChange) {
                return this.props.onActiveChange(true)
            }
        }

        if (prevProps.isActive && !this.props.isActive) {
            if (this.props.onActiveChange) {
                return this.props.onActiveChange(false)
            }
        }
    }

    async load() {
        if (this.props.isActive && this.props.loadOptions) {
            let res
            try {
                res = await this.send(this.props.loadOptions)
                if (this.unmounted) { return }
            } catch (error) {
                if (this.unmounted) { return }
                if (this.props.onError) {
                    return this.props.onError(error)
                }
                throw error
            }
            if (this.props.onLoad) {
                return this.props.onLoad(res)
            }
        }
    }

    componentDidMount() {
        this.load()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    render() {
        const { module } = this.props
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
