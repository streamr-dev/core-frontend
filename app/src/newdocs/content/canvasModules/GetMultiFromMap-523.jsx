/* eslint-disable max-len */
import moduleDescription from './GetMultiFromMap-523.md'

export default {
    id: 523,
    name: 'GetMultiFromMap',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'input map',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            founds: 'an array indicating for each output with 0 (false) and (1) whether a value was found',
            'out-1': 'a (default) value from map, output name is used as key',
        },
        outputNames: [
            'founds',
            'out-1',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_CQxmskOMRUCEgdffqEfJ6A',
            name: 'in',
            longName: 'GetMultiFromMap.in',
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
            id: 'ep_9PovpkExR-6KBwX7IoDGvg',
            name: 'founds',
            longName: 'GetMultiFromMap.founds',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
        {
            id: 'ep_VsuUCZmqRv2LVINKxNP5HQ',
            name: 'endpoint-1543304405024',
            longName: 'GetMultiFromMap.out1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'out1',
            jsClass: 'VariadicOutput',
            variadic: {
                isLast: true,
                index: 1,
            },
        },
    ],
    params: [],
}
