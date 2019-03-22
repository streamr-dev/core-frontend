import * as State from '../state'
import * as Services from '../services'
import { loadModuleDefinition, setup } from './utils'

describe('Variadic Port Handling', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setup(Services.API)
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    describe('Variadic Inputs', () => {
        let Clock
        let Table

        beforeAll(async () => {
            Clock = await loadModuleDefinition('Clock')
            Table = await loadModuleDefinition('Table')
            expect(Clock).toHaveProperty('id')
            expect(Table).toHaveProperty('id')
        })

        it('can add/remove variadic inputs as connections added/removed', () => {
            // connect clock to a table (table has variadic inputs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, Clock)
            canvas = State.addModule(canvas, Table)
            const clock = canvas.modules.find((m) => m.name === 'Clock')
            const table = canvas.modules.find((m) => m.name === 'Table')
            expect(clock).toBeTruthy()
            expect(table).toBeTruthy()
            expect(clock.hash).not.toEqual(table.hash)
            const fromPort = State.findModulePort(canvas, clock.hash, (p) => p.name === 'timestamp')
            const toPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(fromPort).toBeTruthy()
            expect(toPort).toBeTruthy()

            // connect ports
            canvas = State.updateCanvas(State.connectPorts(canvas, fromPort.id, toPort.id))
            expect(State.isPortConnected(canvas, fromPort.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, toPort.id)).toBeTruthy()

            // check a new input is created
            const newVariadicInput = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 2)
            expect(newVariadicInput).toBeTruthy()
            expect(newVariadicInput.displayName).toBe('in2')
            // new input is last
            expect(newVariadicInput.variadic.isLast).toBeTruthy()
            // new input is not connected
            expect(State.isPortConnected(canvas, newVariadicInput.id)).not.toBeTruthy()
            let firstVariadicPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            // first is not last
            expect(firstVariadicPort.variadic.isLast).not.toBeTruthy()

            // connecting to new input creates another input
            canvas = State.updateCanvas(State.connectPorts(canvas, fromPort.id, newVariadicInput.id))

            const newVariadicInput2 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 3)
            expect(newVariadicInput2).toBeTruthy()
            expect(newVariadicInput2.displayName).toBe('in3')
            // new input is last
            expect(newVariadicInput2.variadic.isLast).toBeTruthy()

            // disconnecting first connection should not remove new input
            canvas = State.updateCanvas(State.disconnectPorts(canvas, fromPort.id, toPort.id))
            expect(State.findModulePort(canvas, table.hash, (p) => p.id === newVariadicInput2.id))

            // reconnect
            canvas = State.updateCanvas(State.connectPorts(canvas, fromPort.id, toPort.id))

            // disconnecting last should remove new input
            canvas = State.updateCanvas(State.disconnectPorts(canvas, fromPort.id, newVariadicInput.id))

            // check new input is gone
            expect(State.findModulePort(canvas, table.hash, (p) => p.id === newVariadicInput2.id)).toBeUndefined()

            // disconnecting last should now remove other new input
            canvas = State.updateCanvas(State.disconnectPorts(canvas, fromPort.id, toPort.id))

            expect(State.findModulePort(canvas, table.hash, (p) => p.id === newVariadicInput.id)).toBeUndefined()

            firstVariadicPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(firstVariadicPort).toBeTruthy()

            // first is now last
            expect(firstVariadicPort.variadic.isLast).toBeTruthy()
        })
    })

    describe('Variadic Outputs', () => {
        let GetMultiFromMap
        let Table

        beforeAll(async () => {
            GetMultiFromMap = await loadModuleDefinition('GetMultiFromMap')
            Table = await loadModuleDefinition('Table')
            expect(GetMultiFromMap).toHaveProperty('id')
            expect(Table).toHaveProperty('id')
        })

        it('can add/remove variadic outputs as connections added/removed', () => {
            // connect clock to a table (table has variadic inputs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, GetMultiFromMap)
            canvas = State.addModule(canvas, Table)
            const multi = canvas.modules.find((m) => m.name === 'GetMultiFromMap')
            const table = canvas.modules.find((m) => m.name === 'Table')
            expect(multi).toBeTruthy()
            expect(table).toBeTruthy()
            const fromPort = State.findModulePort(canvas, multi.hash, (p) => p.displayName === 'out1')
            // table input happens to be variadic but not related to this test
            const toPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(fromPort).toBeTruthy()
            expect(toPort).toBeTruthy()

            canvas = State.updateCanvas(State.connectPorts(canvas, fromPort.id, toPort.id))
            expect(State.isPortConnected(canvas, fromPort.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, toPort.id)).toBeTruthy()

            // check a new output is created
            const newVariadicOutput = State.findModulePort(canvas, multi.hash, (p) => p.variadic && p.variadic.index === 2)
            expect(newVariadicOutput).toBeTruthy()
            // new output is last
            expect(newVariadicOutput.variadic.isLast).toBeTruthy()
            // new output is not connected
            expect(State.isPortConnected(canvas, newVariadicOutput.id)).not.toBeTruthy()
            let firstVariadicPort = State.findModulePort(canvas, multi.hash, (p) => p.variadic && p.variadic.index === 1)
            // first is not last
            expect(firstVariadicPort.variadic.isLast).not.toBeTruthy()

            // disconnecting should remove new output
            canvas = State.updateCanvas(State.disconnectPorts(canvas, fromPort.id, toPort.id))

            // check new input is gone
            expect(State.findModulePort(canvas, multi.hash, (p) => p.variadic && p.variadic.index === 2)).toBeUndefined()

            firstVariadicPort = State.findModulePort(canvas, multi.hash, (p) => p.variadic && p.variadic.index === 1)
            expect(firstVariadicPort).toBeTruthy()

            // first is now last
            expect(firstVariadicPort.variadic.isLast).toBeTruthy()
        })
    })
})
