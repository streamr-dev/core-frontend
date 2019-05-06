import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import * as Services from '../services'

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
        await Services.saveNow(subcanvas)

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

        canvas = await Services.saveNow(State.updatePort(canvas, canvasPort.id, (port) => ({
            ...port,
            value: subcanvas.id,
        })))

        canvasModule = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

        expect(clock.params.every(({ name }) => !!canvasModule.params.find((p) => p.name === name))).toBeTruthy()
        expect(clock.inputs.every(({ name }) => !!canvasModule.inputs.find((p) => p.name === name))).toBeTruthy()
        expect(clock.outputs.every(({ name }) => !!canvasModule.outputs.find((p) => p.name === name))).toBeTruthy()
    })
})
