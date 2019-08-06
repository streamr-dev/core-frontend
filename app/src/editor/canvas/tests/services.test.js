import uniqueId from 'lodash/uniqueId'
import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'
import * as sharedServices from '$editor/shared/services'

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

    describe('Replacing Module Definition', () => {
        it('maintains connections after loading new definition for http request', async () => {
            // connect something to http request's body input
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('HTTP Request'))
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            const httpRequest = canvas.modules.find((m) => m.name === 'HTTP Request')
            const text = canvas.modules.find((m) => m.name === 'ConstantText')
            const httpRequestBodyIn = State.findModulePort(canvas, httpRequest.hash, (p) => p.name === 'body')
            const textOut = State.findModulePort(canvas, text.hash, (p) => p.name === 'out')

            const savedCanvas = State.updateCanvas(await Services.create(canvas))
            canvas = State.updateCanvas(State.connectPorts(canvas, textOut.id, httpRequestBodyIn.id))
            expect(State.arePortsConnected(canvas, textOut.id, httpRequestBodyIn.id)).toBeTruthy()
            const httpRequestVerb = State.findModulePort(savedCanvas, httpRequest.hash, (p) => p.name === 'verb')

            // change verb to something else
            canvas = State.updateCanvas(State.setPortUserValue(canvas, httpRequestVerb.id, 'PUT'))
            const updatedHttpRequest = canvas.modules.find((m) => m.name === 'HTTP Request')
            const updatedHttpRequestFromServer = await sharedServices.getModule({
                id: updatedHttpRequest.id,
                configuration: updatedHttpRequest,
            })

            // replace with new definition after changing verb
            canvas = State.updateCanvas(State.replaceModule(canvas, updatedHttpRequestFromServer))

            // ensure connections maintained
            const newHttpRequestBodyIn = State.findModulePort(canvas, httpRequest.hash, (p) => p.name === 'body')
            const newTextOut = State.findModulePort(canvas, text.hash, (p) => p.name === 'out')
            expect(State.arePortsConnected(canvas, newTextOut.id, newHttpRequestBodyIn.id)).toBeTruthy()
        })

        it('maintains connections after loading new definition for canvas module', async () => {
            let subcanvas1 = State.emptyCanvas()
            subcanvas1 = State.addModule(subcanvas1, await loadModuleDefinition('ConstantText'))
            const text1 = subcanvas1.modules.find((m) => m.name === 'ConstantText')
            const text1Out = State.findModulePort(subcanvas1, text1.hash, (p) => p.name === 'out')
            const text1In = State.findModulePort(subcanvas1, text1.hash, (p) => p.name === 'str')

            subcanvas1 = State.setPortOptions(subcanvas1, text1Out.id, {
                export: true,
            })

            subcanvas1 = State.setPortOptions(subcanvas1, text1In.id, {
                export: true,
            })

            subcanvas1 = State.updateCanvas(await Services.create(subcanvas1))

            const subcanvas2 = State.updateCanvas(await Services.duplicateCanvas(subcanvas1))

            // connect something to http request's body input
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Canvas'))

            const table = canvas.modules.find((m) => m.name === 'Table')
            const canvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

            // select the subcanvas
            const canvasPort = State.findModulePort(canvas, canvasModule.hash, (p) => p.name === 'canvas')

            canvas = State.updatePort(canvas, canvasPort.id, (port) => ({
                ...port,
                value: subcanvas1.id,
            }))

            canvas = State.updateCanvas(await Services.create(canvas))

            const canvasModuleOut1 = State.findModulePort(canvas, canvasModule.hash, (p) => p.name === 'out')
            const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            // connect canvas module out to table in1 (creates table in2)
            canvas = State.updateCanvas(State.connectPorts(canvas, canvasModuleOut1.id, tableIn1.id))
            const tableIn2 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 2)
            // connect canvas module out to table in2
            canvas = State.updateCanvas(State.connectPorts(canvas, canvasModuleOut1.id, tableIn2.id))
            // disconnect canvas module out from table in1, leaves first port empty
            canvas = State.updateCanvas(State.disconnectPorts(canvas, canvasModuleOut1.id, tableIn1.id))

            // change subcanvas
            canvas = State.updateCanvas(State.updatePort(canvas, canvasPort.id, (port) => ({
                ...port,
                value: subcanvas2.id,
            })))

            const updatedCanvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')
            const updatedCanvasModuleFromServer = await sharedServices.getModule({
                id: updatedCanvasModule.id,
                configuration: updatedCanvasModule,
            })

            // replace with new definition
            canvas = State.replaceModule(canvas, updatedCanvasModuleFromServer)
            canvas = State.updateCanvas(canvas)

            // ensure connections maintained
            const newTableIn2 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 2)
            const newCanvasModuleOut1 = State.findModulePort(canvas, canvasModule.hash, (p) => p.name === 'out')
            expect(State.arePortsConnected(canvas, newCanvasModuleOut1.id, newTableIn2.id)).toBeTruthy()
        })
    })
})
