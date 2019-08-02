import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import * as Services from '../services'
import './utils'

describe('Connecting Modules', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
        await teardown()
    })

    it('will error if connecting to missing port', async () => {
        // connect ConstantText out to some missing port id
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        const constantText = canvas.modules.find((m) => m.name === 'ConstantText')
        expect(constantText).toBeTruthy()
        const constantTextOut = State.findModulePort(canvas, constantText.hash, (p) => p.name === 'out')
        expect(constantTextOut).toBeTruthy()
        expect(() => {
            State.updateCanvas(State.connectPorts(canvas, constantTextOut.id, 'missingportid'))
        }).toThrow()

        // test server accepts state
        expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
    })

    it('will not error if disconnecting from missing port (assumes port removed)', async () => {
        // connect ConstantText out to ToLowerCase, but try disconnect missing
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ToLowerCase'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ToUpperCase'))
        const constantText = canvas.modules.find((m) => m.name === 'ConstantText')
        const toLowerCase = canvas.modules.find((m) => m.name === 'ToLowerCase')
        expect(constantText).toBeTruthy()
        expect(toLowerCase).toBeTruthy()
        const constantTextOut = State.findModulePort(canvas, constantText.hash, (p) => p.name === 'out')
        const toLowerCaseIn = State.findModulePort(canvas, toLowerCase.hash, (p) => p.name === 'text')
        expect(constantTextOut).toBeTruthy()
        expect(toLowerCaseIn).toBeTruthy()

        canvas = State.updateCanvas(State.connectPorts(canvas, constantTextOut.id, toLowerCaseIn.id))
        const canvasBefore = canvas
        canvas = State.updateCanvas(State.disconnectPorts(canvas, constantTextOut.id, 'missingportid'))
        expect(State.isPortConnected(canvas, constantTextOut.id)).toBeTruthy()
        expect(State.isPortConnected(canvas, toLowerCaseIn.id)).toBeTruthy()
        expect(canvas).toEqual(canvasBefore)

        // test server accepts state
        expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
    })

    it('will not error if disconnecting ports that are not connected', async () => {
        // connect ConstantText out to ToLowerCase, but try disconnect missing
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ToLowerCase'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ToUpperCase'))
        const constantText = canvas.modules.find((m) => m.name === 'ConstantText')
        const toLowerCase = canvas.modules.find((m) => m.name === 'ToLowerCase')
        const toUpperCase = canvas.modules.find((m) => m.name === 'ToUpperCase')
        expect(constantText).toBeTruthy()
        expect(toLowerCase).toBeTruthy()
        expect(toUpperCase).toBeTruthy()
        const constantTextOut = State.findModulePort(canvas, constantText.hash, (p) => p.name === 'out')
        const toLowerCaseIn = State.findModulePort(canvas, toLowerCase.hash, (p) => p.name === 'text')
        const toUpperCaseIn = State.findModulePort(canvas, toUpperCase.hash, (p) => p.name === 'text')
        expect(constantTextOut).toBeTruthy()
        expect(toLowerCaseIn).toBeTruthy()
        expect(toUpperCaseIn).toBeTruthy()

        canvas = State.updateCanvas(State.connectPorts(canvas, constantTextOut.id, toLowerCaseIn.id))
        expect(State.isPortConnected(canvas, constantTextOut.id)).toBeTruthy()

        const canvasBefore = canvas
        canvas = State.updateCanvas(State.disconnectPorts(canvas, constantTextOut.id, toUpperCaseIn.id))
        expect(canvas).toEqual(canvasBefore)
        canvas = State.updateCanvas(State.connectPorts(canvas, constantTextOut.id, toUpperCaseIn.id))
        expect(State.isPortConnected(canvas, toLowerCaseIn.id)).toBeTruthy()
        expect(State.isPortConnected(canvas, toUpperCaseIn.id)).toBeTruthy()
        canvas = State.updateCanvas(State.disconnectPorts(canvas, constantTextOut.id, toUpperCaseIn.id))
        expect(State.isPortConnected(canvas, toLowerCaseIn.id)).toBeTruthy()
        expect(State.isPortConnected(canvas, toUpperCaseIn.id)).not.toBeTruthy()

        // test server accepts state
        expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
    })

    it('can connect & disconnect compatible modules', async () => {
        // connect ConstantText out to ToLowerCase
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ToLowerCase'))
        const constantText = canvas.modules.find((m) => m.name === 'ConstantText')
        const toLowerCase = canvas.modules.find((m) => m.name === 'ToLowerCase')
        expect(constantText).toBeTruthy()
        expect(toLowerCase).toBeTruthy()
        const constantTextOut = State.findModulePort(canvas, constantText.hash, (p) => p.name === 'out')
        const toLowerCaseIn = State.findModulePort(canvas, toLowerCase.hash, (p) => p.name === 'text')
        expect(constantTextOut).toBeTruthy()
        expect(toLowerCaseIn).toBeTruthy()

        // canConnect should be true
        expect(State.canConnectPorts(canvas, constantTextOut.id, toLowerCaseIn.id)).toBeTruthy()

        // connectPorts should connect
        canvas = State.updateCanvas(State.connectPorts(canvas, constantTextOut.id, toLowerCaseIn.id))
        expect(State.isPortConnected(canvas, constantTextOut.id)).toBeTruthy()
        expect(State.isPortConnected(canvas, toLowerCaseIn.id)).toBeTruthy()
        expect(State.arePortsConnected(canvas, constantTextOut.id, toLowerCaseIn.id)).toBeTruthy()
        expect(State.arePortsConnected(canvas, toLowerCaseIn.id, constantTextOut.id)).toBeTruthy()

        canvas = State.updateCanvas(State.disconnectPorts(canvas, constantTextOut.id, toLowerCaseIn.id))
        expect(State.isPortConnected(canvas, constantTextOut.id)).not.toBeTruthy()
        expect(State.isPortConnected(canvas, toLowerCaseIn.id)).not.toBeTruthy()
        expect(State.arePortsConnected(canvas, constantTextOut.id, toLowerCaseIn.id)).not.toBeTruthy()

        // test server accepts state
        expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
    })

    it('disconnects previous after connecting new', async () => {
        // connect ConstantText out to ToLowerCase
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ToLowerCase'))
        const [
            constantText1,
            constantText2,
            toLowerCase,
        ] = canvas.modules

        canvas = State.updateCanvas(State.connectPorts(canvas, constantText1.outputs[0].id, toLowerCase.inputs[0].id))
        expect(State.arePortsConnected(canvas, constantText1.outputs[0].id, toLowerCase.inputs[0].id)).toBeTruthy()
        canvas = State.updateCanvas(State.connectPorts(canvas, constantText2.outputs[0].id, toLowerCase.inputs[0].id))
        // new connection is connected
        expect(State.arePortsConnected(canvas, constantText2.outputs[0].id, toLowerCase.inputs[0].id)).toBeTruthy()
        expect(State.isPortConnected(canvas, toLowerCase.inputs[0].id)).toBeTruthy()
        // old is disconnected
        expect(State.arePortsConnected(canvas, constantText1.outputs[0].id, toLowerCase.inputs[0].id)).not.toBeTruthy()
        expect(State.isPortConnected(canvas, constantText1.outputs[0].id)).not.toBeTruthy()

        // test server accepts state
        expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
    })

    it('can not connect incompatible modules', async () => {
        // connect ConstantText out to ToLowerCase
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('RandomNumber'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ToLowerCase'))
        const randomNumber = canvas.modules.find((m) => m.name === 'RandomNumber')
        const toLowerCase = canvas.modules.find((m) => m.name === 'ToLowerCase')
        expect(randomNumber).toBeTruthy()
        expect(toLowerCase).toBeTruthy()
        const randomNumberOut = State.findModulePort(canvas, randomNumber.hash, (p) => p.name === 'out')
        const toLowerCaseIn = State.findModulePort(canvas, toLowerCase.hash, (p) => p.name === 'text')
        expect(randomNumberOut).toBeTruthy()
        expect(toLowerCaseIn).toBeTruthy()
        // canConnect should not be true
        expect(State.canConnectPorts(canvas, randomNumberOut.id, toLowerCaseIn.id)).not.toBeTruthy()

        // connectPorts should error
        expect(() => {
            State.updateCanvas(State.connectPorts(canvas, randomNumberOut.id, toLowerCaseIn.id))
        }).toThrow()
        // test server accepts state
        expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
    })

    it('can connect ports to self', async () => {
        // connect ConstantText out to ToLowerCase
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
        const constant = canvas.modules.find((m) => m.name === 'Constant')
        let passThrough = canvas.modules.find((m) => m.name === 'PassThrough')
        canvas = State.updateCanvas(State.connectPorts(canvas, constant.outputs[0].id, passThrough.inputs[0].id))
        passThrough = canvas.modules.find((m) => m.name === 'PassThrough')
        // canConnect should be true
        expect(State.canConnectPorts(canvas, passThrough.outputs[0].id, passThrough.inputs[1].id)).toBeTruthy()
        // connectPorts should connect
        canvas = State.updateCanvas(State.connectPorts(canvas, passThrough.outputs[0].id, passThrough.inputs[1].id))
        expect(State.isPortConnected(canvas, passThrough.outputs[0].id)).toBeTruthy()
        expect(State.isPortConnected(canvas, passThrough.inputs[1].id)).toBeTruthy()
        expect(State.arePortsConnected(canvas, passThrough.inputs[1].id, passThrough.outputs[0].id)).toBeTruthy()

        // test server accepts state
        const serverCanvas = State.updateCanvas(await Services.create(canvas))
        expect(serverCanvas).toMatchCanvas(canvas)
        canvas = serverCanvas
        // disconnect works
        canvas = State.updateCanvas(State.disconnectPorts(canvas, passThrough.outputs[0].id, passThrough.inputs[1].id))
        expect(State.isPortConnected(canvas, passThrough.outputs[0].id)).not.toBeTruthy()
        expect(State.isPortConnected(canvas, passThrough.inputs[1].id)).not.toBeTruthy()
        expect(State.arePortsConnected(canvas, passThrough.inputs[1].id, passThrough.outputs[0].id)).not.toBeTruthy()

        // test server accepts state
        expect(State.updateCanvas(await Services.saveNow(canvas))).toMatchCanvas(canvas)
    })

    it('resets param value to default on connect/disconnect', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        let [constant1, constant2] = canvas.modules

        const val1 = 5
        const val2 = 6
        const originalDefault = State.getPortDefaultValue(canvas, constant2.params[0].id)
        canvas = State.updateCanvas(State.setPortUserValue(canvas, constant1.params[0].id, val1))
        canvas = State.updateCanvas(State.setPortUserValue(canvas, constant2.params[0].id, val2))
        canvas = State.updateCanvas(await Services.create(canvas))
        expect(State.getPortValue(canvas, constant2.params[0].id)).toBe(val2)
        canvas = State.updateCanvas(State.connectPorts(canvas, constant1.outputs[0].id, constant2.params[0].id))
        canvas = State.updateCanvas(await Services.saveNow(canvas))
        ;[constant1, constant2] = canvas.modules // eslint-disable-line semi-style
        // server set default to prev value (?!)
        expect(State.getPortDefaultValue(canvas, constant2.params[0].id)).toBe(val2)
        // server updated output and connected param value to input value (Constant module behaviour)
        expect(State.getPortValue(canvas, constant1.params[0].id)).toBe(val1)
        expect(State.getPortValue(canvas, constant1.outputs[0].id)).toBe(val1)
        expect(State.getPortValue(canvas, constant2.params[0].id)).toBe(val1)
        canvas = State.updateCanvas(State.disconnectPorts(canvas, constant1.outputs[0].id, constant2.params[0].id))
        ;[constant1, constant2] = canvas.modules // eslint-disable-line semi-style
        // value should be same as default
        expect(State.getPortValue(canvas, constant2.params[0].id)).toBe(State.getPortDefaultValue(canvas, constant2.params[0].id))
        canvas = State.updateCanvas(await Services.saveNow(canvas))
        // server reset defaultValue to original default (?!)
        expect(State.getPortDefaultValue(canvas, constant2.params[0].id)).toBe(originalDefault)
        // output unchanged
        expect(State.getPortValue(canvas, constant1.params[0].id)).toBe(val1)
    })

    it('resets input value to default on connect/disconnect', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        canvas = State.addModule(canvas, await loadModuleDefinition('MovingAverage'))
        let [constant1, movingAverage] = canvas.modules

        const val1 = 5
        const val2 = 6
        canvas = State.updateCanvas(State.setPortUserValue(canvas, constant1.params[0].id, val1))
        canvas = State.updateCanvas(State.setPortUserValue(canvas, movingAverage.inputs[0].id, val2))
        canvas = State.updateCanvas(await Services.create(canvas))
        expect(State.getPortUserValue(canvas, movingAverage.inputs[0].id)).toBe(val2)
        canvas = State.updateCanvas(State.connectPorts(canvas, constant1.outputs[0].id, movingAverage.inputs[0].id))
        canvas = State.updateCanvas(await Services.saveNow(canvas))
        ;[constant1, movingAverage] = canvas.modules // eslint-disable-line semi-style
        // server updated output and connected param value to input value (Constant module behaviour)
        expect(State.getPortValue(canvas, constant1.params[0].id)).toBe(val1)
        expect(State.getPortValue(canvas, constant1.outputs[0].id)).toBe(val1)

        // for inputs initial value continues to show
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(val2)

        // starting canvas uses port.value
        canvas = State.updateCanvas(await Services.start(canvas))
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(val1)

        canvas = State.updateCanvas(await Services.stop(canvas))
        // shows initialValue after stop
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(val2)
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(State.getPortDefaultValue(canvas, movingAverage.inputs[0].id))

        canvas = State.updateCanvas(State.disconnectPorts(canvas, constant1.outputs[0].id, movingAverage.inputs[0].id))
        ;[constant1, movingAverage] = canvas.modules // eslint-disable-line semi-style
        // disconnect doesn't change value
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(val2)
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(State.getPortDefaultValue(canvas, movingAverage.inputs[0].id))
        canvas = State.updateCanvas(await Services.saveNow(canvas))
        // server value should be same
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(val2)
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(State.getPortDefaultValue(canvas, movingAverage.inputs[0].id))
        // value should be same as default
        expect(State.getPortValue(canvas, movingAverage.inputs[0].id)).toBe(val2)
        expect(State.getPortDefaultValue(canvas, movingAverage.inputs[0].id)).toBe(val2)
        // output unchanged
        expect(State.getPortValue(canvas, constant1.params[0].id)).toBe(val1)
    })
})
