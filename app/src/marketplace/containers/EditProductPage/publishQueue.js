// @flow

import EventEmitter from 'events'

import { transactionStates } from '$shared/utils/constants'
import type { Address } from '$shared/flowtype/web3-types'

export const actionsTypes = {
    UPDATE_ADMIN_FEE: 'updateAdminFee',
    UPDATE_CONTRACT_PRODUCT: 'updateContractProduct',
    CREATE_CONTRACT_PRODUCT: 'createContractProduct',
    REDEPLOY_PAID: 'publishPaid',
    UNDEPLOY_CONTRACT_PRODUCT: 'undeployContractProduct',
    PUBLISH_FREE: 'publishFree',
    UNPUBLISH_FREE: 'unpublishFree',
    PUBLISH_PENDING_CHANGES: 'publishPendingChanges',
}

export type PublishAction = {
    id: string,
    handler: Function,
    requireWeb3?: boolean,
    requireOwner?: Address,
}

export class PublishQueue {
    emitter = new EventEmitter()
    actions = []

    subscribe(event: string, handler: Function) {
        this.emitter.on(event, handler)

        return this
    }

    unsubscribeAll() {
        this.emitter.removeAllListeners()

        return this
    }

    add(action: PublishAction) {
        this.actions.push(action)

        return this
    }

    getActions() {
        return this.actions
    }

    startAction(id: string, nextAction: Function): Promise<void> {
        return new Promise((resolve) => {
            const update = (...args) => this.emitter.emit('status', ...args)
            const done = (...args) => {
                this.emitter.emit('ready', ...args)
                resolve()
            }
            return nextAction.call(
                null,
                update.bind(this, id),
                done.bind(this, id),
            )
        })
    }

    async start() {
        for (let i = 0; i < this.actions.length; i += 1) {
            const { id, handler } = this.actions[i]

            this.emitter.emit('started', id)

            try {
                // eslint-disable-next-line no-await-in-loop
                await this.startAction(id, handler)
            } catch (e) {
                console.error(e)
                this.emitter.emit('status', id, transactionStates.FAILED, e)
            }
        }

        this.emitter.emit('finish')
    }

    needsWeb3 = () => !!(this.actions.find(({ requireWeb3 }) => !!requireWeb3))

    needsOwner = () => {
        const addresses = this.actions.reduce((result, { requireOwner }) => {
            if (requireOwner) {
                result.add(requireOwner)
            }

            return result
        }, new Set([]))

        return [
            ...addresses,
        ]
    }
}

export default PublishQueue
