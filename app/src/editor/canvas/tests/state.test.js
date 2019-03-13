import * as State from '../state'
import * as Mocks from './mocks'

const portMatcher = {
    id: expect.any(String),
    name: expect.any(String),
    longName: expect.any(String),
    type: expect.any(String),
}

describe('Canvas State', () => {
    describe('emptyCanvas', () => {
        it('creates an empty canvas', () => {
            expect(State.emptyCanvas()).toMatchSnapshot({
                modules: [],
            })
        })
    })

    describe('getModule/findModule', () => {
        const canvas = State.addModule(State.emptyCanvas(), Mocks.Clock())

        test('findModule should find modules by matcher', () => {
            const clock = State.findModule(canvas, ({ name }) => name === 'Clock')
            expect(clock).toMatchObject({ name: 'Clock' })
        })

        test('getModule should find modules by hash', () => {
            const clock = State.findModule(canvas, ({ name }) => name === 'Clock')
            expect(State.getModule(canvas, clock.hash)).toBe(clock)
        })

        test('findModule should not error for missing modules', () => {
            expect(State.findModule(canvas, () => false)).toBeUndefined()
        })

        test('getModule should error for missing modules', () => {
            expect(() => State.getModule(canvas, 'missing')).toThrowError(State.MissingEntityError)
        })
    })

    describe('module port access', () => {
        const canvas = State.addModule(State.emptyCanvas(), Mocks.Clock())
        const clock = State.findModule(canvas, ({ name }) => name === 'Clock')

        describe('getModulePorts', () => {
            it('should get all module ports', () => {
                const modulePorts = State.getModulePorts(canvas, clock.hash)
                Object.values(modulePorts).forEach((port) => {
                    expect(modulePorts[port.id]).toBe(port)
                    expect(port).toMatchObject(portMatcher)
                })
            })

            it('should error on missing module', () => {
                expect(() => State.getModulePorts(canvas, 'missing')).toThrowError(State.MissingEntityError)
            })
        })

        describe('getPort', () => {
            const modulePorts = State.getModulePorts(canvas, clock.hash)
            it('should get port', () => {
                Object.values(modulePorts).forEach((port) => {
                    expect(State.getPort(canvas, port.id)).toBe(port)
                })
            })

            it('should error on missing port', () => {
                expect(() => State.getPort(canvas, 'missing')).toThrowError(State.MissingEntityError)
            })
        })

        describe('hasPort', () => {
            const modulePorts = State.getModulePorts(canvas, clock.hash)
            it('should be true if has port', () => {
                Object.values(modulePorts).forEach((port) => {
                    expect(State.hasPort(canvas, port.id)).toBe(true)
                })
            })

            it('should be false on missing port', () => {
                expect(State.hasPort(canvas, 'missing')).toBe(false)
            })
        })

        describe('findModulePort', () => {
            const modulePorts = State.getModulePorts(canvas, clock.hash)

            it('should find ports by matcher', () => {
                Object.values(modulePorts).forEach((port) => {
                    expect(State.findModulePort(canvas, clock.hash, ({ id }) => id === port.id)).toBe(port)
                })
            })

            it('should error on missing module', () => {
                expect(() => State.findModulePort(canvas, 'missing', () => true)).toThrowError(State.MissingEntityError)
            })

            it('should not error on missing port', () => {
                expect(State.findModulePort(canvas, clock.hash, () => false)).toBeUndefined()
            })
        })

        describe('getModuleForPort', () => {
            const modulePorts = State.getModulePorts(canvas, clock.hash)

            it('should get module for port', () => {
                Object.values(modulePorts).forEach((port) => {
                    expect(State.getModuleForPort(canvas, port.id)).toBe(clock)
                })
            })

            it('should error on missing port', () => {
                expect(() => State.getModuleForPort(canvas, 'missing')).toThrowError(State.MissingEntityError)
            })
        })
    })

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
            let subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

            const newModule = Mocks.CanvasWithSelected()
            canvas = State.updateCanvas(State.updateModule(canvas, subCanvas.hash, () => newModule))
            subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

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

            const newModule2 = Mocks.CanvasWithSelected2()
            canvas = State.updateCanvas(State.updateModule(canvas, subCanvas.hash, () => newModule2))
            subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

            expect(subCanvas.params.length === newModule2.params.length).toBeTruthy()
            expect(subCanvas.inputs.length === newModule2.inputs.length).toBeTruthy()
            expect(subCanvas.outputs.length === newModule2.outputs.length).toBeTruthy()

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
            let subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')
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

            const newModule = Mocks.CanvasWithSelected2()
            canvas = State.updateCanvas(State.updateModule(canvas, subCanvas.hash, () => newModule))
            subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

            const fromPort2 = State.findModulePort(canvas, subCanvas.hash, (p) => p.name === 'out')
            const toPort2 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)

            canvas = State.updateCanvas(State.connectPorts(canvas, fromPort2.id, toPort2.id))
            expect(State.isPortConnected(canvas, fromPort2.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, toPort2.id)).toBeTruthy()
        })
    })
})
