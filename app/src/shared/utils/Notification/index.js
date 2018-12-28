// @flow

import EventEmitter from 'events'
import type { Hash } from '$shared/flowtype/web3-types'
import NotificationIcon from '$shared/utils/NotificationIcon'

type Icon = $Values<typeof NotificationIcon>

type Params = {
    title?: ?string,
    description?: ?string,
    txHash?: ?Hash,
    icon?: ?Icon,
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
        const now = new Date()
        this.id = now.getTime()
        this.createdAt = now
        this.title = params.title || ''
        this.description = params.description
        this.txHash = params.txHash
        this.icon = params.icon
    }

    isTx() {
        return !!this.txHash
    }

    autoDismissAfter() {
        return this.isTx() ? 0 : 5 // seconds, 0 = no automatic dismiss
    }
}
