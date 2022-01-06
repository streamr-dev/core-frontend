import ActionQueue from '$mp/utils/actionQueue'
import { actionsTypes } from '$mp/containers/EditProductPage/usePublish'
import { transactionStates } from '$shared/utils/constants'

jest.mock('streamr-client', () => ({}))

describe('Action queue', () => {
    it('calls finish on empty queue', () => {
        const queue = new ActionQueue()

        const handlerFn = jest.fn()
        queue.subscribe('finish', handlerFn)

        queue.start()

        expect(handlerFn).toHaveBeenCalled()
    })

    it('starts an action', async () => {
        const queue = new ActionQueue()

        const startedFn = jest.fn()
        const statusFn = jest.fn()
        const readyFn = jest.fn()
        const finishFn = jest.fn()

        queue
            .subscribe('started', startedFn)
            .subscribe('status', statusFn)
            .subscribe('ready', readyFn)
            .subscribe('finish', finishFn)
            .add({
                id: actionsTypes.PUBLISH_FREE,
                handler: (update, done) => {
                    update('status')
                    done('done')
                },
            })

        await queue.start()

        expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
        expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, 'status')
        expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, 'done')
        expect(finishFn).toHaveBeenCalled()
    })

    it('can update action status multiple times', async () => {
        const queue = new ActionQueue()

        const startedFn = jest.fn()
        const statusFn = jest.fn()
        const readyFn = jest.fn()
        const finishFn = jest.fn()

        queue
            .subscribe('started', startedFn)
            .subscribe('status', statusFn)
            .subscribe('ready', readyFn)
            .subscribe('finish', finishFn)
            .add({
                id: actionsTypes.PUBLISH_FREE,
                handler: (update, done) => {
                    update('status1')

                    setTimeout(() => {
                        update('status2')

                        setTimeout(() => {
                            done('done')
                        }, 500)
                    }, 500)
                },
            })

        await queue.start()

        expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
        expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, 'status1')
        expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, 'status2')
        expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, 'done')
        expect(finishFn).toHaveBeenCalled()
    })

    it('can handle multiple actions', async () => {
        const queue = new ActionQueue()

        const startedFn = jest.fn()
        const statusFn = jest.fn()
        const readyFn = jest.fn()
        const finishFn = jest.fn()

        queue
            .subscribe('started', startedFn)
            .subscribe('status', statusFn)
            .subscribe('ready', readyFn)
            .subscribe('finish', finishFn)
            .add({
                id: actionsTypes.PUBLISH_FREE,
                handler: (update, done) => {
                    update('status1')

                    setTimeout(() => {
                        update('status2')

                        setTimeout(() => {
                            done('done')
                        }, 500)
                    }, 500)
                },
            })
            .add({
                id: actionsTypes.CREATE_CONTRACT_PRODUCT,
                handler: (update, done) => {
                    update('status1')

                    setTimeout(() => {
                        update('status2')

                        setTimeout(() => {
                            done('done')
                        }, 500)
                    }, 500)
                },
            })

        await queue.start()

        expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
        expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, 'status1')
        expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, 'status2')
        expect(startedFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
        expect(statusFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT, 'status1')
        expect(statusFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT, 'status2')
        expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, 'done')
        expect(readyFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT, 'done')
        expect(finishFn).toHaveBeenCalled()
    })

    it('processes the queue in order and moves on to the next one after the previous completes', async () => {
        const queue = new ActionQueue()

        const startedFn = jest.fn()
        const statusFn = jest.fn()
        const readyFn = jest.fn()
        const finishFn = jest.fn()

        queue
            .subscribe('started', startedFn)
            .subscribe('status', statusFn)
            .subscribe('ready', readyFn)
            .subscribe('finish', finishFn)
            .add({
                id: actionsTypes.PUBLISH_FREE,
                handler: (update, done) => {
                    expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                    expect(startedFn).not.toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                    expect(startedFn).not.toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                    done()
                },
            })
            .add({
                id: actionsTypes.CREATE_CONTRACT_PRODUCT,
                handler: (update, done) => {
                    expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                    expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                    expect(startedFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                    expect(startedFn).not.toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                    done()
                },
            })
            .add({
                id: actionsTypes.PUBLISH_PENDING_CHANGES,
                handler: (update, done) => {
                    expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                    expect(startedFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                    expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                    expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                    expect(readyFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                    done()
                },
            })

        await queue.start()

        expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
        expect(finishFn).toHaveBeenCalled()
    })

    it('updates action with error status if action throws an error', async () => {
        const queue = new ActionQueue()

        const startedFn = jest.fn()
        const statusFn = jest.fn()
        const readyFn = jest.fn()
        const finishFn = jest.fn()

        const error = new Error('something happened')
        queue
            .subscribe('started', startedFn)
            .subscribe('status', statusFn)
            .subscribe('ready', readyFn)
            .subscribe('finish', finishFn)
            .add({
                id: actionsTypes.PUBLISH_FREE,
                handler: () => {
                    throw error
                },
            })

        // don't show error as console.error
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => {})
        await queue.start()
        console.error.mockRestore()

        expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
        expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, transactionStates.FAILED, error)
        expect(finishFn).toHaveBeenCalled()
    })

    it('continues next action after previous action throws an error', async () => {
        const queue = new ActionQueue()

        const startedFn = jest.fn()
        const statusFn = jest.fn()
        const readyFn = jest.fn()
        const finishFn = jest.fn()

        const error = new Error('something happened')
        queue
            .subscribe('started', startedFn)
            .subscribe('status', statusFn)
            .subscribe('ready', readyFn)
            .subscribe('finish', finishFn)
            .add({
                id: actionsTypes.PUBLISH_FREE,
                handler: () => {
                    throw error
                },
            })
            .add({
                id: actionsTypes.CREATE_CONTRACT_PRODUCT,
                handler: (update, done) => {
                    expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                    expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, transactionStates.FAILED, error)
                    expect(startedFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                    done()
                },
            })

        // don't show error as console.error
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => {})
        await queue.start()
        console.error.mockRestore()

        expect(readyFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
        expect(finishFn).toHaveBeenCalled()
    })

    describe('needsWeb3', () => {
        it('returns false if there are no actions that require web3', () => {
            const queue = new ActionQueue()

            queue
                .add({
                    id: actionsTypes.PUBLISH_FREE,
                    handler: (update, done) => {
                        done()
                    },
                })
                .add({
                    id: actionsTypes.PUBLISH_PENDING_CHANGES,
                    handler: (update, done) => {
                        done()
                    },
                })

            expect(queue.needsWeb3()).toBe(false)
        })

        it('returns false if there are no actions that require web3', () => {
            const queue = new ActionQueue()

            queue
                .add({
                    id: actionsTypes.PUBLISH_FREE,
                    handler: (update, done) => {
                        done()
                    },
                })
                .add({
                    id: actionsTypes.PUBLISH_PENDING_CHANGES,
                    requireWeb3: true,
                    handler: (update, done) => {
                        done()
                    },
                })
                .add({
                    id: actionsTypes.UPDATE_ADMIN_FEE,
                    requireWeb3: true,
                    handler: (update, done) => {
                        done()
                    },
                })

            expect(queue.needsWeb3()).toBe(true)
        })
    })

    describe('needsOwner', () => {
        it('returns empty array if there are no actions that require owner', () => {
            const queue = new ActionQueue()

            queue
                .add({
                    id: actionsTypes.PUBLISH_FREE,
                    handler: (update, done) => {
                        done()
                    },
                })
                .add({
                    id: actionsTypes.PUBLISH_PENDING_CHANGES,
                    handler: (update, done) => {
                        done()
                    },
                })

            expect(queue.needsOwner()).toStrictEqual([])
        })

        it('returns false if there are no actions that require web3', () => {
            const queue = new ActionQueue()

            queue
                .add({
                    id: actionsTypes.PUBLISH_FREE,
                    handler: (update, done) => {
                        done()
                    },
                })
                .add({
                    id: actionsTypes.PUBLISH_PENDING_CHANGES,
                    requireOwner: '0x123',
                    handler: (update, done) => {
                        done()
                    },
                })
                .add({
                    id: actionsTypes.UPDATE_ADMIN_FEE,
                    requireOwner: '0xabc',
                    handler: (update, done) => {
                        done()
                    },
                })

            expect(queue.needsOwner()).toStrictEqual(['0x123', '0xabc'])
        })
    })
})
