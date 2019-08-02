/* eslint-disable max-len */
import moduleDescription from './NewMap-232.md'

export default {
    id: 232,
    name: 'NewMap',
    path: 'Map',
    help: {
        params: {
            alwaysNew: 'When false (defult), same map is sent every time. When true, a new map is sent on each activation.',
        },
        paramNames: [
            'alwaysNew',
        ],
        inputs: {
            trigger: 'used to activate module',
        },
        inputNames: [
            'trigger',
        ],
        outputs: {
            out: 'a map',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_XNDSOs_LRXC-amaU60EV7A',
            name: 'trigger',
            longName: 'NewMap.trigger',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_X2ThesQqQVKyCRISX61Q8Q',
            name: 'out',
            longName: 'NewMap.out',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_oNWYxJ7NQVuO1AGjsV4Pow',
            name: 'alwaysNew',
            longName: 'NewMap.alwaysNew',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            value: false,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Boolean',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'false',
                    value: 'false',
                },
                {
                    name: 'true',
                    value: 'true',
                },
            ],
            defaultValue: false,
        },
    ],
}
