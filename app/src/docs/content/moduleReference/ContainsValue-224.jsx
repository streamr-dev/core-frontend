/* eslint-disable max-len */
import moduleDescription from './ContainsValue-224.md'

export default {
    id: 224,
    name: 'ContainsValue',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'a map',
            value: 'a value',
        },
        inputNames: [
            'in',
            'value',
        ],
        outputs: {
            found: '1.0 if found, else 0.0.',
        },
        outputNames: [
            'found',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_iwQVVK7FTdWdoj9tNXivOA',
            name: 'in',
            longName: 'ContainsValue.in',
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
        {
            id: 'ep_bKk60y-FTX2hM4_tH3Avyw',
            name: 'value',
            longName: 'ContainsValue.value',
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
            id: 'ep_RMhY4EtxTaea32M7HkiGFA',
            name: 'found',
            longName: 'ContainsValue.found',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
