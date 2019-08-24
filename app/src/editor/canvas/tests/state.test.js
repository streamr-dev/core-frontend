import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import * as Services from '../services'

import './utils'

const portMatcher = {
    id: expect.any(String),
    name: expect.any(String),
    longName: expect.any(String),
    type: expect.any(String),
}

describe('Canvas State', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
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

    describe('updateCanvas', () => {
        it('does not add "undefined" the string as a key', () => {
            const canvas = State.updateCanvas(State.emptyCanvas())
            expect('undefined' in canvas).not.toBeTruthy()
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
                expect(modulePorts.length).toEqual(clock.inputs.length + clock.params.length + clock.outputs.length)
                modulePorts.forEach((port) => {
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
                modulePorts.forEach((port) => {
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
                let expectedPorts = clocks.map((clock) => State.getModulePorts(canvasWithTwoModules, clock.hash))
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
                    modulePorts.forEach((port) => {
                        expect(State.hasPort(canvas, port.id)).toBe(true)
                    })
                })

                it('should be false on missing port', () => {
                    expect(State.hasPort(canvas, 'missing')).toBe(false)
                })
            })

            describe('findModulePort', () => {
                it('should find ports by matcher', () => {
                    modulePorts.forEach((port) => {
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
                    const [port1, port2] = State.getModulePorts(canvasWithTwoModules, clocks[0].hash)
                    expect(State.arePortsOfSameModule(canvasWithTwoModules, port1.id, port2.id)).toBe(true)
                })

                it('should be false if not of same module', () => {
                    const [port1] = State.getModulePorts(canvasWithTwoModules, clocks[0].hash)
                    const [port2] = State.getModulePorts(canvasWithTwoModules, clocks[1].hash)
                    expect(State.arePortsOfSameModule(canvasWithTwoModules, port1.id, port2.id)).toBe(false)
                })

                it('should error on missing port', () => {
                    const [port] = State.getModulePorts(canvasWithTwoModules, clocks[0].hash)
                    expect(() => State.arePortsOfSameModule(canvasWithTwoModules, port.id, 'missing')).toThrowError(State.MissingEntityError)
                    expect(() => State.arePortsOfSameModule(canvasWithTwoModules, 'missing', port.id)).toThrowError(State.MissingEntityError)
                })
            })

            describe('setHistoricalRange', () => {
                const earlyDate = new Date(Date.now() - 9999999).toISOString()
                const lateDate = new Date().toISOString()
                it('should set endDate to beginDate when beginDate < endDate', () => {
                    let canvas = State.emptyCanvas()
                    const beginDate = earlyDate
                    const endDate = lateDate
                    canvas = State.setHistoricalRange(canvas, {
                        beginDate,
                    })
                    canvas = State.setHistoricalRange(canvas, {
                        endDate,
                    })
                    expect(canvas.settings.beginDate).toEqual(beginDate)
                    expect(canvas.settings.endDate).toEqual(endDate)
                })

                it('should set beginDate to endDate when beginDate < endDate & beginDate last set', () => {
                    const endDate = earlyDate
                    const beginDate = lateDate
                    let canvas = State.emptyCanvas()
                    canvas = State.setHistoricalRange(canvas, {
                        beginDate,
                    })
                    canvas = State.setHistoricalRange(canvas, {
                        endDate,
                    })
                    expect(canvas.settings.beginDate).toEqual(endDate)
                    expect(canvas.settings.endDate).toEqual(endDate)
                })

                it('should set endDate to beginDate when beginDate < endDate & endDate last set', () => {
                    const endDate = earlyDate
                    const beginDate = lateDate
                    let canvas = State.emptyCanvas()
                    canvas = State.setHistoricalRange(canvas, {
                        endDate,
                    })
                    canvas = State.setHistoricalRange(canvas, {
                        beginDate,
                    })
                    expect(canvas.settings.beginDate).toEqual(beginDate)
                    expect(canvas.settings.endDate).toEqual(beginDate)
                })
            })

            describe('updateModulePosition', () => {
                it('updates position', async () => {
                    let canvas = State.emptyCanvas()
                    canvas = State.addModule(canvas, await loadModuleDefinition('Equals'))
                    const [equals] = canvas.modules
                    const newPosition = {
                        top: Number.parseInt(equals.layout.position.top, 10) + 333,
                        left: Number.parseInt(equals.layout.position.left, 10) + 333,
                    }
                    canvas = State.updateModulePosition(canvas, equals.hash, newPosition)
                    const [equalsUpdated] = canvas.modules
                    expect(equalsUpdated.layout.position).toMatchObject({
                        top: `${newPosition.top}px`,
                        left: `${newPosition.left}px`,
                    })
                })
                it('throws on bad module hash', () => {
                    let canvas = State.emptyCanvas()
                    expect(() => {
                        canvas = State.updateModulePosition(canvas, 'not found', {
                            top: 0,
                            left: 0,
                        })
                    }).toThrow(State.MissingEntityError)
                })
            })

            describe('updateModuleSize', () => {
                it('updates size', async () => {
                    let canvas = State.emptyCanvas()
                    canvas = State.addModule(canvas, await loadModuleDefinition('Equals'))
                    const [equals] = canvas.modules
                    const newSize = {
                        width: Number.parseInt(equals.layout.width, 10) + 333,
                        height: Number.parseInt(equals.layout.height, 10) + 333,
                    }
                    canvas = State.updateModuleSize(canvas, equals.hash, newSize)
                    const [equalsUpdated] = canvas.modules
                    expect(equalsUpdated.layout).toMatchObject({
                        width: `${newSize.width}px`,
                        height: `${newSize.height}px`,
                    })
                })
                it('throws on bad module hash', () => {
                    let canvas = State.emptyCanvas()
                    expect(() => {
                        canvas = State.updateModuleSize(canvas, 'not found', {
                            width: 100,
                            height: 100,
                        })
                    }).toThrow(State.MissingEntityError)
                })
            })

            describe('{set,get}PortUserValue', () => {
                it('should coerce numberish values to numbers for Double type', async () => {
                    let canvas = State.emptyCanvas()
                    canvas = State.addModule(canvas, await loadModuleDefinition('Equals'))
                    const [equalsModule] = canvas.modules
                    // params[0] is 'tolerance', of Double type
                    // coerce empty string to default
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, ''))
                    const defaultValue = State.getPortDefaultValue(canvas, equalsModule.params[0].id)
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(defaultValue)
                    // handles commas
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, '2,3'))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(2.3)
                    // handles zero
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, '0'))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(0)
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, '0.0'))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(0)
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, 0))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(0)
                    // handles negative numbers
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, '-2.3'))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(-2.3)
                    // ignores whitespace
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, '2.3 '))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(2.3)
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, '2,3  '))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(2.3)
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, '  -2.3  '))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(-2.3)
                    // tries to parse a number
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, '2dasd'))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(2)
                    // Falls back to undefined if it cannot
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, equalsModule.params[0].id, 'dasd'))
                    expect(State.getPortUserValue(canvas, equalsModule.params[0].id)).toBe(defaultValue)

                    // test server accepts state
                    expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
                })
            })

            describe('getPortUserValueOrDefault', () => {
                it('gets value or default if value not set', async () => {
                    let canvas = State.emptyCanvas()
                    canvas = State.addModule(canvas, await loadModuleDefinition('MovingAverage'))
                    const [movingAverage] = canvas.modules
                    // gets value if set
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, movingAverage.params[0].id, 3))
                    expect(State.getPortUserValueOrDefault(canvas, movingAverage.params[0].id)).toBe(3)
                    // gets default if undefined
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, movingAverage.params[0].id, undefined))
                    expect(State.getPortUserValue(canvas, movingAverage.params[0].id)).toBe(0)
                    expect(State.getPortUserValueOrDefault(canvas, movingAverage.params[0].id)).toBe(0)
                    // gets default if empty string
                    canvas = State.updateCanvas(State.setPortUserValue(canvas, movingAverage.params[0].id, ''))
                    expect(State.getPortUserValue(canvas, movingAverage.params[0].id)).toBe(0)
                    expect(State.getPortUserValueOrDefault(canvas, movingAverage.params[0].id)).toBe(0)
                })
            })
        })
    })
})
