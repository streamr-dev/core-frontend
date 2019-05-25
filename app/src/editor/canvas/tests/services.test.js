import uniqueId from 'lodash/uniqueId'
import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as Services from '../services'
import * as State from '../state'
import { canvasMatcher } from './utils'

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
        it('deduplicates canvas name', async () => {
            const canvas = await Services.create()
            const canvas2 = await Services.create()
            expect(canvas.name).not.toEqual(canvas2.name)
        })

        it('can take canvas name', async () => {
            const name1 = `test${uniqueId()}`
            const name2 = `test${uniqueId()}`
            const canvas1 = await Services.create({ name: name1 })
            await Services.create({ name: name1 })
            const canvas3 = await Services.create({ name: name2 })
            expect(canvas1).toMatchObject({
                name: name1,
            })

            expect(canvas3).toMatchObject({
                name: name2,
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
                name: `${name} Copy`,
            })
            const duplicateCanvas2 = await Services.duplicateCanvas(duplicateCanvas)
            expect(duplicateCanvas2).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                name: `${name} Copy 02`,
            })
            // test works with double-digit numbers
            const duplicateCanvas3 = await Services.create({
                ...canvas,
                name: `${name} Copy 10`,
            })
            expect(duplicateCanvas3).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                name: `${name} Copy 10`, // should not change from what was passed in
            })
            const duplicateCanvas4 = await Services.duplicateCanvas(duplicateCanvas3)
            expect(duplicateCanvas4).toMatchObject({
                ...canvas,
                ...canvasMatcher,
                name: `${name} Copy 11`,
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

    describe('Adding Modules', () => {
        it('creates modules with compatible hash values', async () => {
            // add a clock
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('Clock'))
            const clock = canvas.modules.find((m) => m.name === 'Clock')
            expect(clock).toBeTruthy()

            const savedCanvas = await Services.create(canvas)
            const savedClock = savedCanvas.modules.find((m) => m.name === 'Clock')
            expect(savedClock).toBeTruthy()
            // ensure hash value wasn't messed up by type conversion
            expect(savedClock.hash).toEqual(clock.hash)
        })

        it('creates modules with unique hash', async () => {
            let canvas = State.emptyCanvas()
            const ClockDefn = await loadModuleDefinition('Clock')
            // add a few clocks in quick succession
            canvas = State.addModule(canvas, ClockDefn)
            canvas = State.addModule(canvas, ClockDefn)
            canvas = State.addModule(canvas, ClockDefn)
            const hashes = new Set(canvas.modules.map(({ hash }) => hash))
            // make sure they all have unique hashes
            expect(hashes.size).toEqual(3)
        })
    })
})
