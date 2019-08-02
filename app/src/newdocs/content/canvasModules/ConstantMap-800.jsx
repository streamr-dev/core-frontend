/* eslint-disable max-len */
import moduleDescription from './ConstantMap-800.md'

export default {
    id: 800,
    name: 'ConstantMap',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_DdXxtPtmTACLvzHmIUo8eQ',
            name: 'out',
            longName: 'ConstantMap.out',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            value: {},
        },
    ],
    params: [
        {
            id: 'ep_0GrUiRJRSimPLzFcpoEQpA',
            name: 'map',
            longName: 'ConstantMap.map',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            value: {},
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Map',
            ],
            requiresConnection: false,
            defaultValue: {},
        },
    ],
}
