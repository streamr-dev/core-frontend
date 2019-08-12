/* eslint-disable max-len */
import moduleDescription from './FlattenList-552.md'

export default {
    id: 552,
    name: 'FlattenList',
    path: 'List',
    help: {
        params: {
            deep: 'whether to flatten recursively',
        },
        paramNames: [
            'deep',
        ],
        inputs: {
            in: 'input list',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'flattened list',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_p57BuQxkQcS6IfnSHoetgg',
            name: 'in',
            longName: 'FlattenList.in',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'List',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_hUYVia43Qymd0lXthkrKbw',
            name: 'out',
            longName: 'FlattenList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_X9cbR8qJSmeMDvhdUrBp6Q',
            name: 'deep',
            longName: 'FlattenList.deep',
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
