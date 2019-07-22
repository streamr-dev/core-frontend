import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import * as Services from '../services'

import './utils'

describe('Variadic Port Handling', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
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
            expect(State.getPortIfExists(canvas, tableIn3.id)).toBeUndefined()
            // table.in2 still there
            expect(State.getPort(canvas, tableIn2.id)).toBeTruthy()
            // table.in1 still there
            expect(State.getPort(canvas, tableIn1.id)).toBeTruthy()

            // disconnecting table.in1 should now remove other new input
            canvas = State.updateCanvas(State.disconnectPorts(canvas, clockTimestampOut.id, tableIn1.id))

            expect(State.getPortIfExists(canvas, tableIn2.id)).toBeUndefined()

            firstVariadicPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(firstVariadicPort).toBeTruthy()

            // first is now last
            expect(firstVariadicPort.variadic.isLast).toBeTruthy()

            // test server accepts state
            const savedCanvas = State.updateCanvas(await Services.create(canvas))
            expect(savedCanvas).toMatchCanvas(canvas)
        })

        it('can add/remove variadic inputs on export', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
            let table = canvas.modules.find((m) => m.name === 'Table')
            expect(table.inputs.length).toBe(1)

            // export input
            canvas = State.updateCanvas(State.setPortOptions(canvas, table.inputs[0].id, {
                export: true,
            }))
            table = canvas.modules.find((m) => m.name === 'Table')
            // exporting input should add new variadic
            expect(table.inputs.length).toBe(2)

            // de-export input
            canvas = State.updateCanvas(State.setPortOptions(canvas, table.inputs[0].id, {
                export: false,
            }))
            table = canvas.modules.find((m) => m.name === 'Table')
            // de-exporting input should remove variadic
            expect(table.inputs.length).toBe(1)
        })

        it('can move connections', async () => {
            // connect constant to a table (table has variadic inputs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
            const constant = canvas.modules.find((m) => m.name === 'Constant')
            const table = canvas.modules.find((m) => m.name === 'Table')
            expect(constant).toBeTruthy()
            expect(table).toBeTruthy()
            const constantOut = State.findModulePort(canvas, constant.hash, (p) => p.name === 'out')
            const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(constantOut).toBeTruthy()
            expect(tableIn1).toBeTruthy()

            // connect constant.out to table.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, tableIn1.id))
            expect(State.isPortConnected(canvas, constantOut.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, tableIn1.id)).toBeTruthy()

            const tableIn2 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 2)
            expect(tableIn2).toBeTruthy()
            expect(tableIn2.displayName).toBe('in2')

            // move constant.out connection from table.in1 to table.in2
            canvas = State.updateCanvas(State.movePortConnection(canvas, constantOut.id, tableIn2.id, {
                currentInputId: tableIn1.id,
            }))

            // table.in1 should still exist, but not be connected
            expect(State.isPortConnected(canvas, tableIn2.id)).toBeTruthy()
            // table.in2 should still exist, and be connected
            expect(State.isPortConnected(canvas, tableIn1.id)).not.toBeTruthy()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('can connect instead of moving connections', async () => {
            // connect constant to a table (table has variadic inputs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
            const constant = canvas.modules.find((m) => m.name === 'Constant')
            const table = canvas.modules.find((m) => m.name === 'Table')
            expect(constant).toBeTruthy()
            expect(table).toBeTruthy()
            const constantOut = State.findModulePort(canvas, constant.hash, (p) => p.name === 'out')
            const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(constantOut).toBeTruthy()
            expect(tableIn1).toBeTruthy()

            // connect constant.out to table.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, tableIn1.id))
            expect(State.isPortConnected(canvas, constantOut.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, tableIn1.id)).toBeTruthy()

            const tableIn2 = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 2)
            expect(tableIn2).toBeTruthy()
            expect(tableIn2.displayName).toBe('in2')

            // "move" constant.out connection from table.in1 to table.in2
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, tableIn2.id))
            canvas = State.updateCanvas(State.disconnectPorts(canvas, constantOut.id, tableIn1.id))
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, tableIn2.id))

            // table.in1 should still exist, but not be connected
            expect(State.isPortConnected(canvas, tableIn2.id)).toBeTruthy()
            // table.in2 should still exist, and be connected
            expect(State.isPortConnected(canvas, tableIn1.id)).not.toBeTruthy()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('updates index/displayName based on initial config index', async () => {
            // connect constant to a table (table has variadic inputs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Add'))
            const constant = canvas.modules.find((m) => m.name === 'Constant')
            const add = canvas.modules.find((m) => m.name === 'Add')
            const constantOut = State.findModulePort(canvas, constant.hash, (p) => p.name === 'out')
            const addIn3 = State.findModulePort(canvas, add.hash, (p) => p.variadic && p.variadic.index === 3)

            expect(addIn3.displayName).toBe('in3')
            expect(addIn3.variadic.isLast).toBeTruthy()

            // port index 4 doesn't yet exist
            expect(State.findModulePort(canvas, add.hash, (p) => p.variadic && p.variadic.index === 4)).not.toBeTruthy()

            // connect constant.out to add.in3
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, addIn3.id))
            // new port added, index 4
            const addIn4 = State.findModulePort(canvas, add.hash, (p) => p.variadic && p.variadic.index === 4)
            expect(addIn4).toBeTruthy()
            expect(addIn4.displayName).toBe('in4')

            // test server accepts state
            expect(State.updateCanvas(State.updateCanvas(await Services.create(canvas)))).toMatchCanvas(canvas)
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
            expect(State.getPortIfExists(canvas, multiOut2.id)).toBeUndefined()

            firstVariadicPort = State.getPort(canvas, firstVariadicPort.id)
            expect(firstVariadicPort).toBeTruthy()

            // first is now last
            expect(firstVariadicPort.variadic.isLast).toBeTruthy()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
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

            // check a new input & output is created
            const passThroughIn2 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'in2')
            expect(passThroughIn2).toBeTruthy()
            const passThroughOut2 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'out2')
            expect(passThroughOut2).toBeTruthy()

            // new output is last
            expect(passThroughOut2.variadic.isLast).toBeTruthy()
            // new output is not connected
            expect(State.isPortConnected(canvas, passThroughOut2.id)).not.toBeTruthy()
            // output name is same as input name
            // (not sure if this is necessary but it matches old editor behaviour)
            expect(passThroughOut2.name).toBe(passThroughIn2.name)
            // input variadic.linkedOutput is output name
            expect(passThroughIn2.variadic.linkedOutput).toBe(passThroughOut2.name)
            // disconnecting should remove new output
            canvas = State.updateCanvas(State.disconnectPorts(canvas, constantOut.id, passThroughIn1.id))

            // check new output is gone
            expect(State.getPortIfExists(canvas, passThroughOut2.id)).toBeUndefined()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('disconnects output when input is disconnected', async () => {
            // connect Constant to a PassThrough (has input/output pairs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('ValueAsText'))

            const passThrough = canvas.modules.find((m) => m.name === 'PassThrough')
            const constant = canvas.modules.find((m) => m.name === 'Constant')
            const valueText = canvas.modules.find((m) => m.name === 'ValueAsText')
            const constantOut = State.findModulePort(canvas, constant.hash, (p) => p.name === 'out')
            const passThroughIn1 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'in1')
            const passThroughOut1 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'out1')
            const valueTextIn = State.findModulePort(canvas, valueText.hash, (p) => p.name === 'in')
            // connect constant.out to passthrough.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, passThroughIn1.id))
            // connect passthrough.out1 to valueText.in
            canvas = State.updateCanvas(State.connectPorts(canvas, passThroughOut1.id, valueTextIn.id))
            // disconnect passthrough.in1
            canvas = State.updateCanvas(State.disconnectPorts(canvas, constantOut.id, passThroughIn1.id))

            // passThrough.in1 should be disconnected
            expect(State.isPortConnected(canvas, passThroughIn1.id)).not.toBeTruthy()
            // passThrough.out1 should be disconnected
            expect(State.isPortConnected(canvas, passThroughOut1.id)).not.toBeTruthy()
            // valueText.in should be disconnected
            expect(State.isPortConnected(canvas, valueTextIn.id)).not.toBeTruthy()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('updates downstream connection status as output ports removed', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))

            const passThrough = canvas.modules.find((m) => m.name === 'PassThrough')
            const constant = canvas.modules.find((m) => m.name === 'Constant')
            const table = canvas.modules.find((m) => m.name === 'Table')
            expect(passThrough).toBeTruthy()
            expect(constant).toBeTruthy()
            expect(table).toBeTruthy()

            const constantOut = State.findModulePort(canvas, constant.hash, (p) => p.name === 'out')
            const passThroughIn1 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'in1')
            const passThroughOut1 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'out1')
            const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in1')
            // connect constant.out to passthrough.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, passThroughIn1.id))
            const passThroughIn2 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'in2')
            // connect constant.out to passthrough.in2
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, passThroughIn2.id))
            // connect passThrough.out1 to tableIn1.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, passThroughOut1.id, tableIn1.id))
            const tableIn2 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in2')
            const passThroughOut2 = State.findModulePort(canvas, passThrough.hash, (p) => p.longName === 'PassThrough.out2')
            // connect passThrough.out2 to tableIn1.in2
            canvas = State.updateCanvas(State.connectPorts(canvas, passThroughOut2.id, tableIn2.id))
            // disconnect passthrough.in1
            canvas = State.updateCanvas(State.disconnectPorts(canvas, constantOut.id, passThroughIn1.id))
            // table in1 should be disconnected
            expect(State.isPortConnected(canvas, tableIn1.id)).not.toBeTruthy()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('updates downstream connection status as output ports removed in special order', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Table'))

            const passThrough = canvas.modules.find((m) => m.name === 'PassThrough')
            const constant = canvas.modules.find((m) => m.name === 'Constant')
            const table = canvas.modules.find((m) => m.name === 'Table')
            expect(passThrough).toBeTruthy()
            expect(constant).toBeTruthy()
            expect(table).toBeTruthy()

            const constantOut = State.findModulePort(canvas, constant.hash, (p) => p.name === 'out')
            const passThroughIn1 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'in1')
            const passThroughOut1 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'out1')
            const tableIn1 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in1')
            // connect constant.out to passthrough.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, passThroughIn1.id))
            const passThroughIn2 = State.findModulePort(canvas, passThrough.hash, (p) => p.displayName === 'in2')
            // connect constant.out to passthrough.in2
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, passThroughIn2.id))
            // connect passThrough.out1 to tableIn1.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, passThroughOut1.id, tableIn1.id))
            const tableIn2 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in2')
            const passThroughOut2 = State.findModulePort(canvas, passThrough.hash, (p) => p.longName === 'PassThrough.out2')
            // connect passThrough.out2 to tableIn1.in2
            canvas = State.updateCanvas(State.connectPorts(canvas, passThroughOut2.id, tableIn2.id))
            const tableIn3 = State.findModulePort(canvas, table.hash, (p) => p.displayName === 'in3')
            // connect passThrough.out1 to tableIn1.in3 (crossed wires, this is what can cause bug)
            canvas = State.updateCanvas(State.connectPorts(canvas, passThroughOut1.id, tableIn3.id))
            // disconnect passthrough.in1
            canvas = State.updateCanvas(State.disconnectPorts(canvas, constantOut.id, passThroughIn1.id))
            // disconnect passthrough.in2
            canvas = State.updateCanvas(State.disconnectPorts(canvas, constantOut.id, passThroughIn2.id))

            // only table.in1 should exist and should be disconnected
            expect(State.getPortIfExists(canvas, tableIn1.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, tableIn1.id)).not.toBeTruthy()
            expect(State.getPortIfExists(canvas, tableIn2.id)).toBeUndefined()
            expect(State.getPortIfExists(canvas, tableIn3.id)).toBeUndefined()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('uses input type as output type when trying to connect linked output', async () => {
            // connect clock to a table (table has variadic inputs)
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Add'))
            const constantText = canvas.modules.find((m) => m.name === 'ConstantText')
            const constant = canvas.modules.find((m) => m.name === 'Constant')
            const passThrough = canvas.modules.find((m) => m.name === 'PassThrough')
            const add = canvas.modules.find((m) => m.name === 'Add')

            // connect constant.out to passThrough.in1
            const constantOut = State.findModulePort(canvas, constant.hash, (p) => p.name === 'out')
            const passThroughIn1 = State.findModulePort(canvas, passThrough.hash, (p) => p.longName === 'PassThrough.in1')
            canvas = State.updateCanvas(State.connectPorts(canvas, constantOut.id, passThroughIn1.id))

            // connect constantText.out to passThrough.in2
            const constantTextOut = State.findModulePort(canvas, constantText.hash, (p) => p.name === 'out')
            const passThroughIn2 = State.findModulePort(canvas, passThrough.hash, (p) => p.longName === 'PassThrough.in2')
            canvas = State.updateCanvas(State.connectPorts(canvas, constantTextOut.id, passThroughIn2.id))

            // connect passThrough.out1 to Add.in1 should work (passThrough.in1 is number)
            const passThroughOut1 = State.findModulePort(canvas, passThrough.hash, (p) => p.longName === 'PassThrough.out1')
            const addIn1 = State.findModulePort(canvas, add.hash, (p) => p.name === 'in1')
            canvas = State.updateCanvas(State.connectPorts(canvas, passThroughOut1.id, addIn1.id))
            // connect passThrough.out2 to Add.in2 should not work (passThrough.in2 is not number)
            const passThroughOut2 = State.findModulePort(canvas, passThrough.hash, (p) => p.longName === 'PassThrough.out2')
            const addIn2 = State.findModulePort(canvas, add.hash, (p) => p.name === 'in2')
            expect(() => {
                State.updateCanvas(State.connectPorts(canvas, passThroughOut2.id, addIn2.id))
            }).toThrow()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('updates downstream connection status as input type changes', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            const [
                constantText1,
                constantNumber,
                passThrough,
                constantText2,
            ] = canvas.modules

            // connect constantText1.out to passThrough.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantText1.outputs[0].id, passThrough.inputs[0].id))
            expect(State.arePortsConnected(canvas, constantText1.outputs[0].id, passThrough.inputs[0].id)).toBeTruthy()
            // connect passThrough.out1 to constantText2.in
            canvas = State.updateCanvas(State.connectPorts(canvas, passThrough.outputs[0].id, constantText2.params[0].id))
            expect(State.arePortsConnected(canvas, passThrough.outputs[0].id, constantText2.params[0].id)).toBeTruthy()

            // change passthrough.in1/out1 type to number by connecting constantNumber.out to passthrough.in1
            expect(State.canConnectPorts(canvas, constantNumber.outputs[0].id, passThrough.inputs[0].id)).toBeTruthy()
            canvas = State.updateCanvas(State.connectPorts(canvas, constantNumber.outputs[0].id, passThrough.inputs[0].id))
            expect(State.arePortsConnected(canvas, constantNumber.outputs[0].id, passThrough.inputs[0].id)).toBeTruthy()
            // verify previous (incompatible) connections were dropped
            expect(State.arePortsConnected(canvas, constantText1.outputs[0].id, passThrough.inputs[0].id)).not.toBeTruthy()
            expect(State.arePortsConnected(canvas, passThrough.outputs[0].id, constantText2.params[0].id)).not.toBeTruthy()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('can connect linked output when input exported', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Label'))
            const passthrough = canvas.modules.find((m) => m.name === 'PassThrough')
            const label = canvas.modules.find((m) => m.name === 'Label')
            // refuses to connect linked output when input is not connected
            expect(State.canConnectPorts(canvas, passthrough.outputs[0].id, label.inputs[0].id)).not.toBeTruthy()

            // export input
            canvas = State.updateCanvas(State.setPortOptions(canvas, passthrough.inputs[0].id, {
                export: true,
            }))

            // permits connecting linked output when exported input is not connected
            expect(State.canConnectPorts(canvas, passthrough.outputs[0].id, label.inputs[0].id)).toBeTruthy()

            // connect passthrough out to label in
            canvas = State.updateCanvas(State.connectPorts(canvas, passthrough.outputs[0].id, label.inputs[0].id))

            // linked output is connected even though exported input is not connected
            expect(State.arePortsConnected(canvas, passthrough.outputs[0].id, label.inputs[0].id)).toBeTruthy()

            // de-export input
            canvas = State.updateCanvas(State.setPortOptions(canvas, passthrough.inputs[0].id, {
                export: false,
            }))

            // can no longer connect
            expect(State.canConnectPorts(canvas, passthrough.outputs[0].id, label.inputs[0].id)).not.toBeTruthy()
            // connection was automatically removed
            expect(State.arePortsConnected(canvas, passthrough.outputs[0].id, label.inputs[0].id)).not.toBeTruthy()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('handles nested connection changes', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            let [
                constantText1,
                constantNumber,
                passThrough1,
                passThrough2,
                constantText2,
            ] = canvas.modules

            // connect constantText1.out to passThrough1.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantText1.outputs[0].id, passThrough1.inputs[0].id))
            // connect passThrough1.out1 to passThrough2.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, passThrough1.outputs[0].id, passThrough2.inputs[0].id))

            // update variables
            ;[ // eslint-disable-line semi-style
                constantText1,
                constantNumber,
                passThrough1,
                passThrough2,
                constantText2,
            ] = canvas.modules

            // connect passThrough2.out1 to passThrough1.in2
            canvas = State.updateCanvas(State.connectPorts(canvas, passThrough2.outputs[0].id, passThrough1.inputs[1].id))
            expect(State.arePortsConnected(canvas, passThrough1.outputs[0].id, passThrough2.inputs[0].id)).toBeTruthy()

            // connect passThrough1.out2 to constantText2.in
            canvas = State.updateCanvas(State.connectPorts(canvas, passThrough1.outputs[1].id, constantText2.params[0].id))

            // change passthrough1.in1/out1 type to number by connecting constantNumber.out to passthrough1.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantNumber.outputs[0].id, passThrough1.inputs[0].id))

            // check valid connections maintained
            expect(State.arePortsConnected(canvas, constantNumber.outputs[0].id, passThrough1.inputs[0].id)).toBeTruthy()
            expect(State.arePortsConnected(canvas, passThrough1.outputs[0].id, passThrough2.inputs[0].id)).toBeTruthy()
            expect(State.arePortsConnected(canvas, passThrough2.outputs[0].id, passThrough1.inputs[1].id)).toBeTruthy()
            // verify previous (incompatible) connections were dropped
            expect(State.arePortsConnected(canvas, constantNumber.outputs[0].id, constantText2.params[0].id)).not.toBeTruthy()

            // test server accepts state
            expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
        })

        it('permits renaming outputs', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
            let [
                constantText1,
                passThrough1,
            ] = canvas.modules

            // connect constantText1.out to passThrough.in1
            canvas = State.updateCanvas(State.connectPorts(canvas, constantText1.outputs[0].id, passThrough1.inputs[0].id))

            // update variables
            ;[ // eslint-disable-line semi-style
                constantText1,
                passThrough1,
            ] = canvas.modules

            // adopts input displayName
            expect(passThrough1.outputs[0].displayName).toBe(passThrough1.inputs[0].displayName)

            // perform rename
            const newName = 'custom name'
            canvas = State.updateCanvas(State.setPortOptions(canvas, passThrough1.outputs[0].id, {
                displayName: newName,
            }))

            ;[ // eslint-disable-line semi-style
                constantText1,
                passThrough1,
            ] = canvas.modules

            expect(passThrough1.outputs[0].displayName).toBe(newName)

            // test server accepts state
            const serverCanvas = State.updateCanvas(await Services.create(canvas))
            expect(serverCanvas).toMatchCanvas(canvas)
            ;[ // eslint-disable-line semi-style
                constantText1,
                passThrough1,
            ] = serverCanvas.modules
            expect(passThrough1.outputs[0].displayName).toBe(newName)
        })
    })
})
