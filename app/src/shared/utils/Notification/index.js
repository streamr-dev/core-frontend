// @flow

import EventEmitter from 'events'
import type { Hash } from '$shared/flowtype/web3-types'
import { NotificationIcon } from '$shared/utils/constants'

type Icon = $Values<typeof NotificationIcon>

type Params = {
    title?: ?string,
    description?: ?string,
    txHash?: ?Hash,
    icon?: ?Icon,
    autoDismiss?: boolean,
}

const emitter = new EventEmitter()

const events = {
    PUSH: 'NOTIFICATION/PUSH',
}

export default class Notification {
    id: number
    createdAt: Date
    title: string
    description: ?string
    txHash: ?Hash
    icon: ?Icon
    autoDismissAfter: number // seconds

    static ID: number = 0

    static push(params: Params) {
        emitter.emit(Notification.events.PUSH, new Notification(params))
    }

    static subscribe(handler: (Notification) => void) {
        emitter.on(Notification.events.PUSH, handler)
    }

    static unsubscribe(handler: (Notification) => void) {
        emitter.removeListener(Notification.events.PUSH, handler)
    }

    static events = events

    constructor(params: Params) {
        this.constructor.ID += 1
        this.id = this.constructor.ID

        this.createdAt = new Date()
        this.title = params.title || ''
        this.description = params.description || null
        this.txHash = params.txHash || null
        this.icon = params.icon || null
        this.autoDismissAfter = params.autoDismiss !== false ? 5 : 0
    }

    isTx() {
        return !!this.txHash
    }
}
