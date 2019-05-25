import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import * as Services from '../services'

import './utils'

describe('Canvas Module', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
        await teardown()
    })

    it('has a port to select canvas', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Canvas'))

        const canvasModule = canvas.modules.find((m) => m.name === 'Canvas')
        expect(canvasModule).toBeTruthy()

        const canvasPort = State.findModulePort(canvas, canvasModule.hash, (p) => p.name === 'canvas')
        expect(canvasPort).toBeTruthy()
    })

    it('shows canvases with exports', async () => {
        // Create a subcanvas
        let subcanvas = await Services.create()
        subcanvas = State.addModule(subcanvas, await loadModuleDefinition('Clock'))

        const clock = subcanvas.modules.find((m) => m.name === 'Clock')

        // export outputs & save
        subcanvas = clock.outputs.reduce((subcanvas, { id }) => State.setPortOptions(subcanvas, id, {
            export: true,
        }), subcanvas)

        expect(State.updateCanvas(await Services.saveNow(subcanvas))).toMatchCanvas({
            ...subcanvas,
            hasExports: true,
        })

        // create main canvas and check that the created canvas shows up
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Canvas'))

        const canvasModule = canvas.modules.find((m) => m.name === 'Canvas')
        expect(canvasModule).toBeTruthy()

        const canvasPort = State.findModulePort(canvas, canvasModule.hash, (p) => p.name === 'canvas')

        const subCanvasOption = canvasPort.possibleValues.find(({ value }) => value === subcanvas.id)
        expect(subCanvasOption).toBeTruthy()
        expect(subCanvasOption.value).toEqual(subcanvas.id)
    })

    it('reloads inputs and outputs from selected canvas', async () => {
        // Create a subcanvas
        let subcanvas = await Services.create()
        subcanvas = State.addModule(subcanvas, await loadModuleDefinition('Clock'))

        const clock = subcanvas.modules.find((m) => m.name === 'Clock')

        // export inputs, params, outputs & save
        subcanvas = clock.inputs.reduce((subcanvas, { id }) => State.setPortOptions(subcanvas, id, {
            export: true,
        }), subcanvas)
        subcanvas = clock.params.reduce((subcanvas, { id }) => State.setPortOptions(subcanvas, id, {
            export: true,
        }), subcanvas)
        subcanvas = clock.outputs.reduce((subcanvas, { id }) => State.setPortOptions(subcanvas, id, {
            export: true,
        }), subcanvas)
        await Services.saveNow(subcanvas)

        let canvas = await Services.create()
        canvas = State.addModule(canvas, await loadModuleDefinition('Canvas'))
        let canvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

        // select the subcanvas
        const canvasPort = State.findModulePort(canvas, canvasModule.hash, (p) => p.name === 'canvas')

        canvas = State.updatePort(canvas, canvasPort.id, (port) => ({
            ...port,
            value: subcanvas.id,
        }))

        canvas = State.updateCanvas(await Services.saveNow(canvas))

        canvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

        expect(clock.params.every(({ name }) => !!canvasModule.params.find((p) => p.name === name))).toBeTruthy()
        expect(clock.inputs.every(({ name }) => !!canvasModule.inputs.find((p) => p.name === name))).toBeTruthy()
        expect(clock.outputs.every(({ name }) => !!canvasModule.outputs.find((p) => p.name === name))).toBeTruthy()
    })

    it('works when exported inputs are variadic', async () => {
        // Create a subcanvas
        let subcanvas = await Services.create()
        subcanvas = State.addModule(subcanvas, await loadModuleDefinition('PassThrough'))
        subcanvas = State.addModule(subcanvas, await loadModuleDefinition('Constant'))

        const passThrough = subcanvas.modules.find((m) => m.name === 'PassThrough')

        // export inputs
        subcanvas = passThrough.inputs.reduce((subcanvas, { id }) => State.setPortOptions(subcanvas, id, {
            export: true,
        }), subcanvas)
        await Services.saveNow(State.updateCanvas(subcanvas))

        let canvas = await Services.create()
        canvas = State.addModule(canvas, await loadModuleDefinition('Canvas'))
        let canvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

        // select the subcanvas
        const canvasPort = State.findModulePort(canvas, canvasModule.hash, (p) => p.name === 'canvas')

        canvas = State.updateCanvas(await Services.saveNow(State.updateCanvas(State.updatePort(canvas, canvasPort.id, (port) => ({
            ...port,
            value: subcanvas.id,
        })))))

        canvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

        expect(passThrough.inputs.every(({ name }) => !!canvasModule.inputs.find((p) => p.name === name))).toBeTruthy()
    })

    it('works when exported inputs are variadic & connected', async () => {
        // Create a subcanvas
        let subcanvas = await Services.create({ name: 'Sub Canvas' })
        subcanvas = State.addModule(subcanvas, await loadModuleDefinition('PassThrough'))
        subcanvas = State.addModule(subcanvas, await loadModuleDefinition('Constant'))
        subcanvas = State.addModule(subcanvas, await loadModuleDefinition('Abs'))

        const passThrough = subcanvas.modules.find((m) => m.name === 'PassThrough')
        const constant1 = subcanvas.modules.find((m) => m.name === 'Constant')
        const abs = subcanvas.modules.find((m) => m.name === 'Abs')
        // connect constant1 to passthrough
        const constant1Out = State.findModulePort(subcanvas, constant1.hash, (p) => p.name === 'out')
        const passThroughIn1 = State.findModulePort(subcanvas, passThrough.hash, (p) => p.longName === 'PassThrough.in1')
        subcanvas = State.updateCanvas(State.connectPorts(subcanvas, constant1Out.id, passThroughIn1.id))

        // connect passthrough to constant2
        const passThroughOut1 = State.findModulePort(subcanvas, passThrough.hash, (p) => p.longName === 'PassThrough.out1')
        const absIn = State.findModulePort(subcanvas, abs.hash, (p) => p.name === 'in')
        subcanvas = State.updateCanvas(State.connectPorts(subcanvas, passThroughOut1.id, absIn.id))

        // export passthrough input
        subcanvas = State.setPortOptions(subcanvas, passThroughIn1.id, {
            export: true,
        })
        await Services.saveNow(State.updateCanvas(subcanvas))
        let canvas = await Services.create({ name: 'Parent Canvas' })
        canvas = State.addModule(canvas, await loadModuleDefinition('Canvas'))
        let canvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

        // select the subcanvas
        const canvasPort = State.findModulePort(canvas, canvasModule.hash, (p) => p.name === 'canvas')

        canvas = State.updateCanvas(await Services.saveNow(State.updateCanvas(State.updatePort(canvas, canvasPort.id, (port) => ({
            ...port,
            value: subcanvas.id,
        })))))

        canvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

        expect(passThrough.inputs.every(({ name }) => !!canvasModule.inputs.find((p) => p.name === name))).toBeTruthy()
    })
})
