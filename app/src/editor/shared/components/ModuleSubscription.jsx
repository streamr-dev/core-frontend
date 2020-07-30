/* eslint-disable react/no-unused-state */

import React from 'react'

import Subscription from '$shared/components/Subscription'
import * as services from '$editor/shared/services'

export default class ModuleSubscription extends React.PureComponent {
    // This method is intended to be exposed through a ref. Example usage:
    //
    // this.subscription = React.createRef()
    // ...
    // <ModuleSubscription
    //    ...
    //    ref={this.subscription}
    // />
    //
    // Because `ModuleSubscription` is a component, the `ref` will be a `ModuleSubscription` instance,
    // rather than a dom node. Then the value of the `ref.current` is the same object as the `this`
    // inside a `ModuleSubscription` component method because `send` is a method of `ModuleSubscription`,
    // you can call the `send` method via the ref.
    send = async (data) => {
        if (this.unmounted) { return }
        if (!this.props.isActive) { return } // do nothing if not active
        const { canvasId, dashboardId, moduleHash } = this.props
        return services.send({
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
                isActive={!!this.props.isSubscriptionActive}
                uiChannel={module.uiChannel}
                resendLast={options.uiResendLast && options.uiResendLast.value}
                resendFrom={options.uiResendFrom && options.uiResendFrom.value}
                resendTo={options.resendTo && options.resendTo.value}
                resendFromTime={options.uiResendFromTime && options.uiResendFromTime.value}
            />
        )
    }
}
