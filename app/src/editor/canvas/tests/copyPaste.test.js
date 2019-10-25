import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import * as Services from '../services'

import './utils'

describe('copy/paste with getModuleCopy', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
        await teardown()
    })

    it('does not affect original module', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Clock'))
        const [clock] = canvas.modules
        const clockPorts = State.getModulePorts(canvas, clock.hash)
        const clockCopyDefn = State.getModuleCopy(canvas, clock.hash)
        canvas = State.addModule(canvas, clockCopyDefn)
        const [updatedClock] = canvas.modules
        expect(clock).toEqual(updatedClock)
        const updatedClockPorts = State.getModulePorts(canvas, updatedClock.hash)
        expect(updatedClock).toEqual(clock)
        expect(updatedClockPorts).toEqual(clockPorts)
    })

    it('can be applied without creating duplicate ports', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Clock'))
        const [clock] = canvas.modules
        const clockCopyDefn = State.getModuleCopy(canvas, clock.hash)
        canvas = State.addModule(canvas, clockCopyDefn)
        const clockCopy = canvas.modules[canvas.modules.length - 1]
        expect(clockCopy.hash).not.toEqual(clock.hash)
        expect(clockCopy.id).toEqual(clock.id)
        const clockPorts = State.getModulePorts(canvas, clock.hash)
        const clockCopyPorts = State.getModulePorts(canvas, clockCopy.hash)
        // no duplicate port ids
        clockCopyPorts.forEach((port) => {
            expect(clockPorts.find((p) => p.id === port.id)).not.toBeTruthy()
        })
    })

    it('does not copy connections', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        canvas = State.addModule(canvas, await loadModuleDefinition('ToLowerCase'))
        const [constantText, toLowerCase1] = canvas.modules
        canvas = State.updateCanvas(State.connectPorts(canvas, constantText.outputs[0].id, toLowerCase1.inputs[0].id))
        const toLowerCaseDefn = State.getModuleCopy(canvas, toLowerCase1.hash)
        canvas = State.addModule(canvas, toLowerCaseDefn)
        const [,, toLowerCase2] = canvas.modules
        // new module should have no connections
        expect(State.moduleHasConnections(canvas, toLowerCase2.hash)).not.toBeTruthy()
    })

    it('gives unique port ids for multiple pastes', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ToLowerCase'))
        const [toLowerCase1] = canvas.modules
        const toLowerCaseDefn = State.getModuleCopy(canvas, toLowerCase1.hash)
        canvas = State.addModule(canvas, toLowerCaseDefn)
        canvas = State.addModule(canvas, toLowerCaseDefn)
        const [, toLowerCase2, toLowerCase3] = canvas.modules
        const toLowerCase2Ports = State.getModulePorts(canvas, toLowerCase2.hash)
        const toLowerCase3Ports = State.getModulePorts(canvas, toLowerCase3.hash)

        toLowerCase2Ports.forEach((port) => {
            expect(toLowerCase3Ports.find((p) => p.id === port.id)).not.toBeTruthy()
        })
    })

    it('does not copy uiChannel', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
        const [table1] = canvas.modules
        canvas = State.addModule(canvas, State.getModuleCopy(canvas, table1.hash))
        const [, table2] = canvas.modules
        // new uiChannel is set
        expect(table2.uiChannel.id).toBeTruthy()
        // no duplicate uiChannel
        expect(table1.uiChannel.id).not.toEqual(table2.uiChannel.id)
        const newUiChannelId = table2.uiChannel.id
        // ensure server accepts state
        canvas = State.updateCanvas(await Services.create(canvas))
        const [table1a, table2a] = canvas.modules
        // uiChannels set after save
        expect(table1a.uiChannel.id).toBeTruthy()
        expect(table2a.uiChannel.id).toBeTruthy()
        // no duplicate uiChannel
        expect(table1.uiChannel.id).not.toEqual(table2.uiChannel.id)
        // uses generated id
        expect(table2.uiChannel.id).toEqual(newUiChannelId)
    })

    it('does not copy export state', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        const [constantText1] = canvas.modules
        canvas = State.setPortOptions(canvas, constantText1.params[0].id, {
            export: true,
        })
        const constantText1Defn = State.getModuleCopy(canvas, constantText1.hash)
        canvas = State.addModule(canvas, constantText1Defn)
        const [, constantText2] = canvas.modules
        // copied port should not be exported
        expect(State.isPortExported(canvas, constantText2.params[0].id)).not.toBeTruthy()
    })

    it('works with variadic ports', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
        canvas = State.addModule(canvas, await loadModuleDefinition('Table'))
        const [constantText, table1] = canvas.modules
        canvas = State.updateCanvas(State.connectPorts(canvas, constantText.outputs[0].id, table1.inputs[0].id))
        const table1Defn = State.getModuleCopy(canvas, table1.hash)
        canvas = State.addModule(canvas, table1Defn)
        const [,, table2] = canvas.modules
        const table1Ports = State.getModulePorts(canvas, table1.hash)
        const table2Ports = State.getModulePorts(canvas, table2.hash)
        // no duplicate port ids
        table2Ports.forEach((port) => {
            expect(table1Ports.find((p) => p.id === port.id)).not.toBeTruthy()
        })
    })

    it('works with linked variadic ports', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('PassThrough'))
        const [passThrough1] = canvas.modules

        // need to verify exported state is also removed for variadics
        canvas = State.setPortOptions(canvas, passThrough1.inputs[0].id, {
            export: true,
        })
        canvas = State.setPortOptions(canvas, passThrough1.outputs[0].id, {
            export: true,
        })
        const passThrough1Defn = State.getModuleCopy(canvas, passThrough1.hash)
        canvas = State.addModule(canvas, passThrough1Defn)

        const [, passThrough2] = canvas.modules
        const passThrough1Ports = State.getModulePorts(canvas, passThrough1.hash)
        const passThrough2Ports = State.getModulePorts(canvas, passThrough2.hash)

        passThrough2Ports.forEach((port) => {
            const linkedPort = State.findLinkedVariadicPort(canvas, port.id)
            // port exists
            expect(linkedPort).toBeTruthy()
            // linked port does not exist in original module by id or name
            expect(passThrough1Ports.find((p) => p.name === linkedPort.name || p.id === linkedPort.id)).not.toBeTruthy()
            // linked port does exist in new module by id and name
            expect(passThrough2Ports.find((p) => p.name === linkedPort.name && p.id === linkedPort.id)).toBeTruthy()
            // copied port should not be exported
            expect(State.isPortExported(canvas, port.id)).not.toBeTruthy()
        })
    })
})
