import uniqueId from 'lodash/uniqueId'
import { setupAuthorizationHeader } from '$editor/shared/tests/utils'

import * as Services from '../services'
import * as State from '../state'

const canvasMatcher = {
    id: expect.any(String),
    name: expect.any(String),
    created: expect.any(String),
    updated: expect.any(String),
    uiChannel: expect.objectContaining({
        id: expect.any(String),
    }),
}

describe('Canvas Services', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000) // service can take some time to respond initially

    afterAll(async () => {
        await Services.deleteAllCanvases()
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
            expect(duplicateCanvas.name.startsWith(canvas.name))
        })

        it('deduplicates canvas name', async () => {
            const name = `test${uniqueId()}`
            const canvas = await Services.create({
                name,
            })
            const duplicateCanvas = await Services.duplicateCanvas(canvas)
            expect(duplicateCanvas).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                name: `${name} (2)`,
            })
            const duplicateCanvas2 = await Services.duplicateCanvas(duplicateCanvas)
            expect(duplicateCanvas2).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                name: `${name} (3)`,
            })
            // test works with double-digit numbers
            const duplicateCanvas3 = await Services.create({
                ...canvas,
                name: `${name} (10)`,
            })
            expect(duplicateCanvas3).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                name: `${name} (10)`, // should not change
            })
            const duplicateCanvas4 = await Services.duplicateCanvas(duplicateCanvas3)
            expect(duplicateCanvas4).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                name: `${name} (11)`,
            })
        })

        it('can duplicate a running canvas', async () => {
            const canvas = await Services.create()
            const startedCanvas = await Services.start(canvas)

            const duplicateCanvas = await Services.duplicateCanvas(startedCanvas)
            expect(duplicateCanvas).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                state: State.RunStates.Stopped,
            })
            await Services.stop(startedCanvas)
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
            expect(State.isRunning(canvas)).toBeFalsy()

            const startedCanvas = await Services.start(canvas)
            expect(State.isRunning(startedCanvas)).toBeTruthy()
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
            expect(State.isRunning(stoppedCanvas)).toBeFalsy()
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
    })
})
