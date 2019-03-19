import * as Services from '../services'
import * as State from '../state'

import { setup } from './utils'

const canvasMatcher = {
    id: expect.any(String),
    created: expect.any(String),
    updated: expect.any(String),
    uiChannel: expect.objectContaining({
        id: expect.any(String),
    }),
}

describe('Canvas Services', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setup(Services.API)
    }, 60000) // service can take some time to respond initially

    afterAll(async () => {
        await teardown()
    })

    describe('create', () => {
        it('can create canvases', async () => {
            const canvases = await Services.loadCanvases()
            expect(canvases.length).toBe(0)
            const canvas = await Services.create()
            expect(canvas).toMatchSnapshot(canvasMatcher)

            expect(canvas).toHaveProperty('id')
            expect(canvas.modules.length).toBe(0)
            const canvasesAfterCreate = await Services.loadCanvases()
            expect(canvasesAfterCreate.length).toBe(1)
            expect(canvasesAfterCreate).toContainEqual({
                ...canvas,
                created: canvasMatcher.created,
                updated: canvasMatcher.updated,
            })
        })
    })

    describe('loadCanvas', () => {
        it('errors if no canvas', () => {
            expect(Services.loadCanvas({
                id: 'invalid',
            })).rejects.toThrow()
        })

        it('can load a canvas', async () => {
            const canvas = await Services.create()
            const { id } = canvas
            const loadedCanvas = await Services.loadCanvas({ id })
            expect(loadedCanvas).toMatchObject({
                ...canvas,
                // loading canvas gives different created/updated time than create ???
                created: canvasMatcher.created,
                updated: canvasMatcher.updated,
            })
        })
    })

    describe('deleteCanvas', () => {
        it('errors if no canvas', () => {
            expect(Services.deleteCanvas({
                id: 'invalid',
            })).rejects.toThrow()
        })

        it('can delete a canvas', async () => {
            const canvas = await Services.create()
            const { id } = canvas
            await Services.deleteCanvas({ id })
            await expect(Services.loadCanvas({ id })).rejects.toThrow()
        })
    })

    describe('duplicateCanvas', () => {
        it('errors if no canvas', () => {
            expect(Services.duplicateCanvas({
                id: 'invalid',
            })).rejects.toThrow()
        })

        it('can duplicate a canvas', async () => {
            const canvas = await Services.create()
            const duplicateCanvas = await Services.duplicateCanvas(canvas)
            expect(duplicateCanvas.id).not.toEqual(canvas.id)
            expect(duplicateCanvas).toMatchObject({
                ...canvas,
                ...canvasMatcher,
            })
        })
    })

    describe('start/stop canvas', () => {
        it('errors if no canvas', () => {
            expect(Services.start({
                id: 'invalid',
            })).rejects.toThrow()
            expect(Services.stop({
                id: 'invalid',
            })).rejects.toThrow()
        })

        it('can start & stop a canvas', async () => {
            const canvas = await Services.create()
            const startedCanvas = await Services.start(canvas)
            expect(startedCanvas).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                id: canvas.id,
                state: State.RunStates.Running,
                startedById: expect.any(Number),
            })

            // can't start a running canvas
            await expect(Services.start(canvas)).rejects.toThrow()

            const stoppedCanvas = await Services.stop(canvas)
            expect(stoppedCanvas).toMatchObject({
                ...startedCanvas,
                ...canvasMatcher,
                id: canvas.id,
                state: State.RunStates.Stopped,
                startedById: expect.any(Number),
            })

            // can't stop a stopped canvas
            await expect(Services.stop(canvas)).rejects.toThrow()
        })

        it('can start adhoc canvases', async () => {
            const canvas = await Services.create()
            const startedAdhocCanvas = await Services.start(canvas, { adhoc: true })
            expect(startedAdhocCanvas.id).not.toEqual(canvas.id)
            expect(startedAdhocCanvas).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                adhoc: true,
                state: State.RunStates.Running,
                startedById: expect.any(Number),
                settings: expect.objectContaining({
                    parentCanvasId: canvas.id, // captures parent canvas id
                }),
            })

            // adhoc canvas will immediately stop, so this should throw
            await expect(Services.stop(startedAdhocCanvas)).rejects.toThrow()
        })
    })
})
