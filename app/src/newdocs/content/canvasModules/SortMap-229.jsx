/* eslint-disable max-len */
import moduleDescription from './SortMap-229.md'

export default {
    id: 229,
    name: 'SortMap',
    path: 'Map',
    help: {
        params: {
            byValue: 'when false (default), sorts by key. when true, sorts by value',
        },
        paramNames: [
            'byValue',
        ],
        inputs: {
            in: 'a map',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'a sorted map',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_pAH7XGVvQaO0C3ZTOd7Trg',
            name: 'in',
            longName: 'SortMap.in',
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
            id: 'ep_ignCb2VhSlSvzS31CcWT0g',
            name: 'out',
            longName: 'SortMap.out',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_FRtsyITeTnSsomrgOSHJEw',
            name: 'by',
            longName: 'SortMap.by',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'value',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'key',
                    value: 'key',
                },
                {
                    name: 'value',
                    value: 'value',
                },
            ],
            defaultValue: 'value',
            isTextArea: false,
        },
        {
            id: 'ep_oh5aVB6eQjKG6VQkg6F8Bg',
            name: 'order',
            longName: 'SortMap.order',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'asc',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'ascending',
                    value: 'asc',
                },
                {
                    name: 'descending',
                    value: 'desc',
                },
            ],
            defaultValue: 'asc',
            isTextArea: false,
        },
    ],
}
