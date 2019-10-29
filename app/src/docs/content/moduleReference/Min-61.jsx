/* eslint-disable max-len */
import moduleDescription from './Min-61.md'

export default {
    id: 61,
    name: 'Min',
    path: 'Time Series: Simple Math',
    help: {
        outputNames: [],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {},
        outputs: {},
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_IT_oFGCsSmurPE_OWyUQTw',
            name: 'A',
            longName: 'Min.A',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_FpYRLfn3QVaMcwh9I6004w',
            name: 'B',
            longName: 'Min.B',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_WTMEy2CfTlGrh0bteoJn0Q',
            name: 'out',
            longName: 'Min.out',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
