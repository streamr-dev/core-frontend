// @flow

import EventEmitter from 'events'
import uuid from 'uuid'
import type { Hash } from '$shared/flowtype/web3-types'

const emitter = new EventEmitter()

export const actionTypes = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    PURCHASE: 'PURCHASE', // user purchased
    PAYMENT: 'PAYMENT', // user received payment
    ADD: 'ADD',
    SHARE: 'SHARE',
    DEPLOY: 'DEPLOY',
    UNDEPLOY: 'UNDEPLOY',
    PUBLISH: 'PUBLISH',
    UNPUBLISH: 'UNPUBLISH',
}

type Action = $Keys<typeof actionTypes>

type Params = {
    id?: string,
    timestamp?: Date,
    action: Action,
    txHash?: Hash,
    userId?: ?string,
    productId?: ?string,
    streamId?: ?string,
    canvasId?: ?string,
    dashboardId?: ?string,
}

const events = {
    PUSH: 'ACTIVITY/PUSH',
}

class Activity {
    id: string
    timestamp: Date
    action: Action
    txHash: ?Hash
    userId: ?string
    productId: ?string
    streamId: ?string
    canvasId: ?string
    dashboardId: ?string

    static push(params: Params) {
        emitter.emit(events.PUSH, new Activity(params))
    }

    static subscribe(handler: (Activity) => void) {
        emitter.on(events.PUSH, handler)
    }

    static unsubscribe(handler: (Activity) => void) {
        emitter.removeListener(events.PUSH, handler)
    }

    static deserialize(data: any) {
        const params = {
            id: data.id,
            timestamp: data.timestamp,
            action: data.action,
            userId: data.userId,
            txHash: data.txHash,
            productId: data.productId,
            streamId: data.streamId,
            canvasId: data.canvasId,
            dashboardId: data.dashboardId,
        }
        return new Activity(params)
    }

    constructor(params: Params) {
        this.id = params.id || uuid()
        this.timestamp = params.timestamp || new Date()
        this.action = params.action
        this.userId = params.userId || null
        this.txHash = params.txHash || null
        this.productId = params.productId || null
        this.streamId = params.streamId || null
        this.canvasId = params.canvasId || null
        this.dashboardId = params.dashboardId || null
    }

    serialize() {
        return {
            id: this.id,
            timestamp: this.timestamp,
            action: this.action,
            userId: this.userId,
            txHash: this.txHash,
            productId: this.productId,
            streamId: this.streamId,
            canvasId: this.canvasId,
            dashboardId: this.dashboardId,
        }
    }
}

export default Activity
