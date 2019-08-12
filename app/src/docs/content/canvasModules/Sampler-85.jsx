/* eslint-disable max-len */
import moduleDescription from './Sampler-85.md'

export default {
    id: 85,
    name: 'Sampler',
    path: 'Time Series: Triggers',
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
            id: 'ep_yF4r7bKxQcWaTgOxJvdyeQ',
            name: 'trigger',
            longName: 'Sampler.trigger',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
        {
            id: 'ep_u755y0OaSpC-0Q0jubwkEg',
            name: 'value',
            longName: 'Sampler.value',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_jLJ-CUeXReq0w3vfSmR4Xw',
            name: 'value',
            longName: 'Sampler.value',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
