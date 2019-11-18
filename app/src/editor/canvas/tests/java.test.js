import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'
import * as SharedServices from '$editor/shared/services'

import * as State from '../state'
import * as Services from '../services'

import './utils'

const footer = `
public void initialize() {
  // Initialize local variables
}

public void sendOutput() {
  //Write your module code here
}

public void clearState() {
  // Clear internal state
}
`.trim()

function defineStubModule({ inputs = 0, outputs = 0 }) {
    const lines = []
    for (let i = 0; i < inputs; i += 1) {
        lines.push(`TimeSeriesInput input${i} = new TimeSeriesInput(this,"in${i}");`)
    }
    for (let i = 0; i < outputs; i += 1) {
        lines.push(`TimeSeriesOutput output${i} = new TimeSeriesOutput(this,"out${i}");`)
    }
    lines.push(footer)
    return lines.join('\n')
}

describe('Java Module', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
        await teardown()
    })

    it('will maintain connections when java module updated', async () => {
        let canvas = State.emptyCanvas()
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
        canvas = State.addModule(canvas, await loadModuleDefinition('JavaModule'))

        const javaModuleInitial = canvas.modules[canvas.modules.length - 1]
        // create a module with 1 input and 1 output
        canvas = State.updateModule(canvas, javaModuleInitial.hash, (m) => ({
            ...m,
            code: defineStubModule({
                inputs: 1,
                outputs: 1,
            }),
        }))
        // server response will provide updated module definition
        canvas = State.updateCanvas(await Services.create(canvas))

        // connect constant1.out -> java.in & java.out -> constant2.in
        const [constant1, constant2, javaModule] = canvas.modules
        canvas = State.updateCanvas(State.connectPorts(canvas, constant1.outputs[0].id, javaModule.inputs[0].id))
        canvas = State.updateCanvas(State.connectPorts(canvas, javaModule.outputs[0].id, constant2.params[0].id))

        // check connections are ok, this shouldn't fail
        expect(State.arePortsConnected(canvas, constant1.outputs[0].id, javaModule.inputs[0].id)).toBeTruthy()
        expect(State.arePortsConnected(canvas, javaModule.outputs[0].id, constant2.params[0].id)).toBeTruthy()

        // add new inputs & outputs (old inputs/outputs should remain)
        canvas = State.updateModule(canvas, javaModule.hash, (m) => ({
            ...m,
            code: defineStubModule({
                inputs: 2,
                outputs: 1,
            }),
        }))
        // simulate pressing 'apply' button in java editor
        const javaModuleUpdated = canvas.modules[canvas.modules.length - 1]

        // if this test is timing out, this is probably where it's doing so.
        const newModule = await SharedServices.getModule({
            id: javaModuleUpdated.id,
            configuration: javaModuleUpdated,
        })

        // use of replaceModule should maintain existing connections (important)
        canvas = State.replaceModule(canvas, newModule)
        expect(State.arePortsConnected(canvas, constant1.outputs[0].id, javaModule.inputs[0].id)).toBeTruthy()
        expect(State.arePortsConnected(canvas, javaModule.outputs[0].id, constant2.params[0].id)).toBeTruthy()
    }, 30000) // java module takes a long time sometimes
})
