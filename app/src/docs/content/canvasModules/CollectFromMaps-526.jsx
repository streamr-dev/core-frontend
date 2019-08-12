/* eslint-disable max-len */
import moduleDescription from './CollectFromMaps-526.md'

export default {
    id: 526,
    name: 'CollectFromMaps',
    path: 'Map',
    help: {
        params: {
            selector: 'a map property name',
        },
        paramNames: [
            'selector',
        ],
        inputs: {
            listOrMap: 'list or map to collect from',
        },
        inputNames: [
            'listOrMap',
        ],
        outputs: {
            listOrMap: 'collected list or map',
        },
        outputNames: [
            'listOrMap',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_ENXA6rJtRL6FwqGc7wkfRw',
            name: 'listOrMap',
            longName: 'CollectFromMaps.listOrMap',
            type: 'List Map',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'List',
                'Map',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_YTNmUeDFSjKumObfDSdIaA',
            name: 'listOrMap',
            longName: 'CollectFromMaps.listOrMap',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_qU7i0KpnT_2wgJvScb0CLw',
            name: 'selector',
            longName: 'CollectFromMaps.selector',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '',
            isTextArea: false,
        },
    ],
}
