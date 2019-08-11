/* eslint-disable max-len */
import moduleDescription from './GetFromMap-225.md'

export default {
    id: 225,
    name: 'GetFromMap',
    path: 'Map',
    help: {
        params: {
            key: 'a key',
        },
        paramNames: [
            'key',
        ],
        inputs: {
            in: 'a map',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            found: '1.0 if key was present in map, 0.0 otherwise.',
            out: 'the corresponding value if key was found.',
        },
        outputNames: [
            'found',
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_1WvJFYsMT5aD_70xTrvaQw',
            name: 'in',
            longName: 'GetFromMap.in',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Map',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_1tx_E_IJSs-lR7n0M2B8Xw',
            name: 'found',
            longName: 'GetFromMap.found',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_yZOilO9nRTiXjB9hxpNK9Q',
            name: 'out',
            longName: 'GetFromMap.out',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_6FWci1qbStKlVZmFTyeJnQ',
            name: 'key',
            longName: 'GetFromMap.key',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'id',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'id',
            isTextArea: false,
        },
    ],
}
