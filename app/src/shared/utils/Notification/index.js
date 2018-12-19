// @flow

import type { Hash } from '$shared/flowtype/web3-types'
import type { NotificationIcon } from '$mp/flowtype/common-types'
import EventEmitter from 'events'

type Params = {
    title?: ?string,
    description?: ?string,
    txHash?: ?Hash,
    icon?: ?NotificationIcon,
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
    icon: ?NotificationIcon

    static push(params: Params) {
        emitter.emit(Notification.events.PUSH, new Notification(params))
    }

    static attach(handler: (Notification) => void) {
        emitter.on(Notification.events.PUSH, handler)
    }

    static detach(handler: (Notification) => void) {
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
}
