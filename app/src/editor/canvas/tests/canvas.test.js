import * as State from '../state'
import * as Mocks from './mocks'

describe('Canvas Module', () => {
    it('has a port to select canvas', () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, Mocks.Canvas())

        const subCanvas = canvas.modules.find((m) => m.name === 'Canvas')
        expect(subCanvas).toBeTruthy()

        const canvasPort = State.findModulePort(canvas, subCanvas.hash, (p) => p.name === 'canvas')
        expect(canvasPort).toBeTruthy()
    })

    it('reloads inputs and outputs from selected canvas', () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, Mocks.Canvas())
        const { hash } = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

        const newModule = Mocks.CanvasWithSelected()
        const newCanvas = State.updateCanvas(State.updateModule(canvas, hash, () => newModule))
        const subCanvas = newCanvas.modules.find((m) => m.jsModule === 'CanvasModule')

        expect(subCanvas.params.length === newModule.params.length).toBeTruthy()
        expect(subCanvas.inputs.length === newModule.inputs.length).toBeTruthy()
        expect(subCanvas.outputs.length === newModule.outputs.length).toBeTruthy()

        subCanvas.outputs.forEach((output) => {
            const exportedOutput = subCanvas.modules.find((m) => m.outputs.find((o) => o.id === output.id))
            expect(exportedOutput).toBeTruthy()
        })
        subCanvas.inputs.forEach((input) => {
            const exportedInput = subCanvas.modules.find((m) => m.inputs.find((i) => i.id === input.id))
            expect(exportedInput).toBeTruthy()
        })
    })

    it('clears connected ports on reload', () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, Mocks.CanvasWithSelected())
        canvas = State.addModule(canvas, Mocks.Table())
        const subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')
        const table = canvas.modules.find((m) => m.name === 'Table')
        expect(subCanvas).toBeTruthy()
        expect(table).toBeTruthy()
        expect(subCanvas.hash).not.toEqual(table.hash)
        const fromPort = State.findModulePort(canvas, subCanvas.hash, (p) => p.name === 'timestamp')
        const toPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
        expect(fromPort).toBeTruthy()
        expect(toPort).toBeTruthy()

        canvas = State.updateCanvas(State.connectPorts(canvas, fromPort.id, toPort.id))
        expect(State.isPortConnected(canvas, fromPort.id)).toBeTruthy()
        expect(State.isPortConnected(canvas, toPort.id)).toBeTruthy()
    })
})
