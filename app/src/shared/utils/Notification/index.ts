import { $Values } from 'utility-types'
import EventEmitter from 'events'
import { Hash } from '$shared/types/web3-types'
import { NotificationIcon } from '$shared/utils/constants'
type Icon = $Values<typeof NotificationIcon>
type Params = {
    title?: string | null | undefined
    description?: string | null | undefined
    txHash?: Hash | null | undefined
    icon?: Icon | null | undefined
    autoDismiss?: number | false
}
const emitter = new EventEmitter()
const events = {
    PUSH: 'NOTIFICATION/PUSH',
}
export default class Notification {
    id: number
    createdAt: Date
    title: string
    description: string | null | undefined
    txHash: Hash | null | undefined
    icon: Icon | null | undefined
    autoDismissAfter: number // seconds

    static ID = 0

    static push(params: Params): void {
        emitter.emit(Notification.events.PUSH, new Notification(params))
    }

    static subscribe(handler: (arg0: Notification) => void): void {
        emitter.on(Notification.events.PUSH, handler)
    }

    static unsubscribe(handler: (arg0: Notification) => void): void {
        emitter.removeListener(Notification.events.PUSH, handler)
    }

    static events = events

    constructor(params: Params) {
        Notification.ID += 1
        this.id = Notification.ID
        this.createdAt = new Date()
        this.title = params.title || ''
        this.description = params.description || null
        this.txHash = params.txHash || null
        this.icon = params.icon || null
        this.autoDismissAfter = params.autoDismiss !== false ? 5 : 0
    }

    isTx(): boolean {
        return !!this.txHash
    }
}
