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
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        const constantText = canvas.modules.find((m) => m.name === 'ConstantText')
        expect(constantText).toBeTruthy()
        const constantTextOut = State.findModulePort(canvas, constantText.hash, (p) => p.name === 'out')
        const constantTextIn = State.findModulePort(canvas, constantText.hash, (p) => p.name === 'str')
        expect(constantTextOut).toBeTruthy()
        expect(constantTextIn).toBeTruthy()

        // canConnect should be true
        expect(State.canConnectPorts(canvas, constantTextOut.id, constantTextIn.id)).toBeTruthy()

        // connectPorts should connect
        canvas = State.updateCanvas(State.connectPorts(canvas, constantTextOut.id, constantTextIn.id))
        expect(State.isPortConnected(canvas, constantTextOut.id)).toBeTruthy()
        expect(State.isPortConnected(canvas, constantTextIn.id)).toBeTruthy()
        expect(State.arePortsConnected(canvas, constantTextIn.id, constantTextOut.id)).toBeTruthy()

        canvas = State.updateCanvas(State.disconnectPorts(canvas, constantTextOut.id, constantTextIn.id))
        expect(State.isPortConnected(canvas, constantTextOut.id)).not.toBeTruthy()
        expect(State.isPortConnected(canvas, constantTextIn.id)).not.toBeTruthy()
        expect(State.arePortsConnected(canvas, constantTextIn.id, constantTextOut.id)).not.toBeTruthy()

        // test server accepts state
        expect(State.updateCanvas(await Services.create(canvas))).toMatchCanvas(canvas)
    })
})
