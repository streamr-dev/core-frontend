import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import * as Services from '../services'

import './utils'

describe('Canvas applyChanges', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
        await teardown()
    })

    it('can apply changes', async () => {
        let canvas = await Services.create()
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        const [constant1] = canvas.modules
        // pretend server changed value
        const serverCanvas = State.updateCanvas(State.setPortUserValue(canvas, constant1.params[0].id, 3))
        canvas = State.applyChanges({
            sent: canvas,
            received: serverCanvas,
            current: canvas,
        })
        // changes from "server" were applied
        expect(canvas).toMatchCanvas(serverCanvas)
    })

    it('does not apply changes if current changed', async () => {
        let canvas = await Services.create()
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        const [constant1] = canvas.modules

        const currentCanvas = State.updateCanvas(State.setPortUserValue(canvas, constant1.params[0].id, 3))
        const serverCanvas = State.updateCanvas(State.setPortUserValue(canvas, constant1.params[0].id, 4))
        canvas = State.applyChanges({
            sent: canvas,
            received: serverCanvas,
            current: currentCanvas,
        })
        // changes from server were not applied
        expect(canvas).toMatchCanvas(currentCanvas)
    })

    it('will apply changes only to unchanged modules', async () => {
        let canvas = await Services.create()
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        const [constant1, constant2] = canvas.modules
        // change first constant locally
        const currentCanvas = State.updateCanvas(State.setPortUserValue(canvas, constant1.params[0].id, 3))

        // change both constants on "server"
        let serverCanvas = State.updateCanvas(State.setPortUserValue(canvas, constant1.params[0].id, 4))
        serverCanvas = State.updateCanvas(State.setPortUserValue(canvas, constant2.params[0].id, 5))

        canvas = State.applyChanges({
            sent: canvas,
            received: serverCanvas,
            current: currentCanvas,
        })

        // local changes to first constant were not clobbered
        expect(State.getPortUserValue(canvas, constant1.params[0].id)).toBe(3)
        // second constant changes were applied
        expect(State.getPortUserValue(canvas, constant2.params[0].id)).toBe(5)
    })
})
