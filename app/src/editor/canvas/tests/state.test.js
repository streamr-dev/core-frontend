import * as State from '../state'
import * as Services from '../services'
import * as Mocks from './mocks'
import { setup, loadModuleDefinition } from './utils'

const portMatcher = {
    id: expect.any(String),
    name: expect.any(String),
    longName: expect.any(String),
    type: expect.any(String),
}

describe('Canvas State', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setup(Services.API)
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    let Clock

    beforeAll(async () => {
        Clock = await loadModuleDefinition('Clock')
        expect(Clock).toHaveProperty('id')
    })

    describe('emptyCanvas', () => {
        it('creates an empty canvas', () => {
            expect(State.emptyCanvas()).toMatchSnapshot({
                modules: [],
            })
        })
    })

    describe('getModule/findModule', () => {
        let canvas

        beforeAll(() => {
            canvas = State.addModule(State.emptyCanvas(), Clock)
        })

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
        let canvas
        let clock

        beforeAll(() => {
            canvas = State.addModule(State.emptyCanvas(), Clock)
            clock = State.findModule(canvas, ({ name }) => name === 'Clock')
        })

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
            it('should get port', () => {
                const modulePorts = State.getModulePorts(canvas, clock.hash)
                Object.values(modulePorts).forEach((port) => {
                    expect(State.getPort(canvas, port.id)).toBe(port)
                })
            })

            it('should error on missing port', () => {
                expect(() => State.getPort(canvas, 'missing')).toThrowError(State.MissingEntityError)
            })
        })

        describe('getAllPorts', () => {
            let canvasWithTwoModules
            let clocks

            beforeAll(async () => {
                canvasWithTwoModules = State.addModule(canvas, await loadModuleDefinition('Clock'))
                clocks = State.findModules(canvasWithTwoModules, ({ name }) => name === 'Clock')
            })

            it('should get all ports', () => {
                // get all expected ports via getModulePorts
                let expectedPorts = clocks.map((clock) => Object.values(State.getModulePorts(canvasWithTwoModules, clock.hash)))
                expectedPorts = new Set([].concat(...expectedPorts)) // flatten array into Set

                const allPorts = new Set(State.getAllPorts(canvasWithTwoModules))
                expect(expectedPorts).toEqual(allPorts)
            })
        })

        describe('ports', () => {
            let modulePorts

            beforeAll(() => {
                modulePorts = State.getModulePorts(canvas, clock.hash)
            })

            describe('hasPort', () => {
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
                it('should get module for port', () => {
                    Object.values(modulePorts).forEach((port) => {
                        expect(State.getModuleForPort(canvas, port.id)).toBe(clock)
                    })
                })

                it('should error on missing port', () => {
                    expect(() => State.getModuleForPort(canvas, 'missing')).toThrowError(State.MissingEntityError)
                })
            })

            describe('arePortsOfSameModule', () => {
                let canvasWithTwoModules
                let clocks

                beforeAll(async () => {
                    canvasWithTwoModules = State.addModule(canvas, await loadModuleDefinition('Clock'))
                    clocks = State.findModules(canvasWithTwoModules, ({ name }) => name === 'Clock')
                })

                it('should be true for same module', () => {
                    const modulePorts = State.getModulePorts(canvasWithTwoModules, clocks[0].hash)
                    const [port1, port2] = Object.values(modulePorts)
                    expect(State.arePortsOfSameModule(canvasWithTwoModules, port1.id, port2.id)).toBe(true)
                })

                it('should be false if not of same module', () => {
                    const modulePorts1 = State.getModulePorts(canvasWithTwoModules, clocks[0].hash)
                    const modulePorts2 = State.getModulePorts(canvasWithTwoModules, clocks[1].hash)
                    const [port1] = Object.values(modulePorts1)
                    const [port2] = Object.values(modulePorts2)
                    expect(State.arePortsOfSameModule(canvasWithTwoModules, port1.id, port2.id)).toBe(false)
                })

                it('should error on missing port', () => {
                    const modulePorts = State.getModulePorts(canvasWithTwoModules, clocks[0].hash)
                    const port = Object.values(modulePorts)[0]
                    expect(() => State.arePortsOfSameModule(canvasWithTwoModules, port.id, 'missing')).toThrowError(State.MissingEntityError)
                    expect(() => State.arePortsOfSameModule(canvasWithTwoModules, 'missing', port.id)).toThrowError(State.MissingEntityError)
                })
            })
        })
    })

    describe('Canvas Module', () => {
        it('has a port to select canvas', () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, Mocks.Canvas())

            const subCanvas = canvas.modules.find((m) => m.name === 'Canvas')
            expect(subCanvas).toBeTruthy()

            // ensure port name is called canvas
            const canvasPort = State.findModulePort(canvas, subCanvas.hash, (p) => p.name === 'canvas')
            expect(canvasPort).toBeTruthy()
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

            // connect subcanvas output to table
            canvas = State.updateCanvas(State.connectPorts(canvas, fromPort.id, toPort.id))
            expect(State.isPortConnected(canvas, fromPort.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, toPort.id)).toBeTruthy()

            // choose new canvas
            const newModule = Mocks.CanvasWithSelected2()
            canvas = State.updateCanvas(State.updateModule(canvas, subCanvas.hash, () => newModule))
            subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

            const fromPort2 = State.findModulePort(canvas, subCanvas.hash, (p) => p.name === 'out')
            const toPort2 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(toPort2.id).toBe(toPort.id)
            expect(State.hasPort(canvas, fromPort.id)).not.toBeTruthy() // original port gone
            expect(fromPort2.id).not.toBe(fromPort.id) // ensure canvas output port has new id

            // old ports should be disconnected
            expect(State.isPortConnected(canvas, fromPort.id)).not.toBeTruthy()
            expect(State.isPortConnected(canvas, fromPort2.id)).not.toBeTruthy()
            expect(State.isPortConnected(canvas, toPort2.id)).not.toBeTruthy()

            // connect new port to table
            canvas = State.updateCanvas(State.connectPorts(canvas, fromPort2.id, toPort2.id))
            expect(State.isPortConnected(canvas, fromPort2.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, toPort2.id)).toBeTruthy()
        })

        it('reloads inputs and outputs from selected canvas', () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, Mocks.Canvas())
            let subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

            const newModule = Mocks.CanvasWithSelected()
            canvas = State.updateCanvas(State.updateModule(canvas, subCanvas.hash, () => newModule))
            subCanvas = canvas.modules.find((m) => m.jsModule === 'CanvasModule')

            expect(subCanvas.params.length).toBe(newModule.params.length)
            expect(subCanvas.inputs.length).toBe(newModule.inputs.length)
            expect(subCanvas.outputs.length).toBe(newModule.outputs.length)

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

            expect(subCanvas.params.length).toBe(newModule2.params.length)
            expect(subCanvas.inputs.length).toBe(newModule2.inputs.length)
            expect(subCanvas.outputs.length).toBe(newModule2.outputs.length)

            subCanvas.outputs.forEach((output) => {
                const exportedOutput = subCanvas.modules.find((m) => m.outputs.find((o) => o.id === output.id))
                expect(exportedOutput).toBeTruthy()
            })

            subCanvas.inputs.forEach((input) => {
                const exportedInput = subCanvas.modules.find((m) => m.inputs.find((i) => i.id === input.id))
                expect(exportedInput).toBeTruthy()
            })
        })
    })
})
