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
        it('can add/remove variadic inputs as connections added/removed', async () => {
            // connect clock to a table (table has variadic inputs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('Clock'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
            const clock = canvas.modules.find((m) => m.name === 'Clock')
            const table = canvas.modules.find((m) => m.name === 'Table')
            expect(clock).toBeTruthy()
            expect(table).toBeTruthy()
            expect(clock.hash).not.toEqual(table.hash)
            const clockTimestampOut = State.findModulePort(canvas, clock.hash, (p) => p.name === 'timestamp')
            const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(clockTimestampOut).toBeTruthy()
            expect(tableIn1).toBeTruthy()

            // connect ports
            canvas = State.updateCanvas(State.connectPorts(canvas, clockTimestampOut.id, tableIn1.id))
            expect(State.isPortConnected(canvas, clockTimestampOut.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, tableIn1.id)).toBeTruthy()

            // check a new input is created
            const tableIn2 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 2)
            expect(tableIn2).toBeTruthy()
            expect(tableIn2.displayName).toBe('in2')
            // new input is last
            expect(tableIn2.variadic.isLast).toBeTruthy()
            // new input is not connected
            expect(State.isPortConnected(canvas, tableIn2.id)).not.toBeTruthy()
            let firstVariadicPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            // first is not last
            expect(firstVariadicPort.variadic.isLast).not.toBeTruthy()

            // connecting to new input creates another input
            canvas = State.updateCanvas(State.connectPorts(canvas, clockTimestampOut.id, tableIn2.id))

            const tableIn3 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 3)
            expect(tableIn3).toBeTruthy()
            expect(tableIn3.displayName).toBe('in3')
            // new input is last
            expect(tableIn3.variadic.isLast).toBeTruthy()

            // disconnecting first connection should not remove new input
            canvas = State.updateCanvas(State.disconnectPorts(canvas, clockTimestampOut.id, tableIn1.id))
            expect(State.findModulePort(canvas, table.hash, (p) => p.id === tableIn3.id))

            // reconnect
            canvas = State.updateCanvas(State.connectPorts(canvas, clockTimestampOut.id, tableIn1.id))

            // disconnecting last should remove new input
            canvas = State.updateCanvas(State.disconnectPorts(canvas, clockTimestampOut.id, tableIn2.id))

            // table.in3 gone
            expect(State.getPort(canvas, tableIn3.id)).toBeUndefined()
            // table.in2 still there
            expect(State.getPort(canvas, tableIn2.id)).toBeTruthy()
            // table.in1 still there
            expect(State.getPort(canvas, tableIn1.id)).toBeTruthy()

            // disconnecting table.in1 should now remove other new input
            canvas = State.updateCanvas(State.disconnectPorts(canvas, clockTimestampOut.id, tableIn1.id))

            expect(State.getPort(canvas, tableIn2.id)).toBeUndefined()

            firstVariadicPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(firstVariadicPort).toBeTruthy()

            // first is now last
            expect(firstVariadicPort.variadic.isLast).toBeTruthy()
        })
    })

    describe('Variadic Outputs', () => {
        it('can add/remove variadic outputs as connections added/removed', async () => {
            // connect GetMultiFromMap (variadic outs) to a ValueAsText
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('GetMultiFromMap'))
            canvas = State.addModule(canvas, await loadModuleDefinition('ValueAsText'))
            const multi = canvas.modules.find((m) => m.name === 'GetMultiFromMap')
            const valueText = canvas.modules.find((m) => m.name === 'ValueAsText')
            expect(multi).toBeTruthy()
            expect(valueText).toBeTruthy()
            const multiOut1 = State.findModulePort(canvas, multi.hash, (p) => p.displayName === 'out1')
            const valueTextIn = State.findModulePort(canvas, valueText.hash, (p) => p.name === 'in')
            expect(multiOut1).toBeTruthy()
            expect(valueTextIn).toBeTruthy()

            canvas = State.updateCanvas(State.connectPorts(canvas, multiOut1.id, valueTextIn.id))
            expect(State.isPortConnected(canvas, multiOut1.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, valueTextIn.id)).toBeTruthy()

            // check a new output is created
            const multiOut2 = State.findModulePort(canvas, multi.hash, (p) => p.variadic && p.variadic.index === 2)
            expect(multiOut2).toBeTruthy()
            // new output is last
            expect(multiOut2.variadic.isLast).toBeTruthy()
            // new output is not connected
            expect(State.isPortConnected(canvas, multiOut2.id)).not.toBeTruthy()
            let firstVariadicPort = State.getPort(canvas, multiOut1.id)
            // first is not last
            expect(firstVariadicPort.variadic.isLast).not.toBeTruthy()
            expect(firstVariadicPort.variadic.index).toBe(1)

            // disconnecting should remove new output
            canvas = State.updateCanvas(State.disconnectPorts(canvas, multiOut1.id, valueTextIn.id))

            // check new input is gone
            expect(State.getPort(canvas, multiOut2.id)).toBeUndefined()

            firstVariadicPort = State.getPort(canvas, firstVariadicPort.id)
            expect(firstVariadicPort).toBeTruthy()

            // first is now last
            expect(firstVariadicPort.variadic.isLast).toBeTruthy()
        })
    })

    describe('Variadic Input/Output Pairs', () => {
        it('can add/remove variadic inputs as connections added/removed', async () => {
            // connect Constant to a PassThrough (has input/output pairs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))

            const passThrough = canvas.modules.find((m) => m.name === 'PassThrough')
            const constant = canvas.modules.find((m) => m.name === 'Constant')
            expect(passThrough).toBeTruthy()
            expect(constant).toBeTruthy()

            const constantOut = State.findModulePort(canvas, constant.hash, (p) => p.name === 'out')
            const passThroughIn1 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'in1')
            expect(constantOut).toBeTruthy()
            expect(passThroughIn1).toBeTruthy()

            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, passThroughIn1.id))
            expect(State.isPortConnected(canvas, constantOut.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, passThroughIn1.id)).toBeTruthy()

            // check a new output is created
            const passThroughOut2 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'out2')
            expect(passThroughOut2).toBeTruthy()
            // new output is last
            expect(passThroughOut2.variadic.isLast).toBeTruthy()
            // new output is not connected
            expect(State.isPortConnected(canvas, passThroughOut2.id)).not.toBeTruthy()
            // disconnecting should remove new output
            canvas = State.updateCanvas(State.disconnectPorts(canvas, constantOut.id, passThroughIn1.id))

            // check new output is gone
            expect(State.getPortIfExists(canvas, passThroughOut2)).toBeUndefined()
        })
    })
})
