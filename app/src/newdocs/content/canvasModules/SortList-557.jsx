/* eslint-disable max-len */
import moduleDescription from './SortList-557.md'

export default {
    id: 557,
    name: 'SortList',
    path: 'List',
    help: {
        params: {
            order: 'ascending or descending',
        },
        paramNames: [
            'order',
        ],
        inputs: {
            in: 'list to sort',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'sorted list',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_MTsREaIISL-guLOPXyBLog',
            name: 'in',
            longName: 'SortList.in',
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
            id: 'ep_zaBpp6SLQOuS2ZMxLbNKRA',
            name: 'out',
            longName: 'SortList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_-1SRK9nXQ7CUNkrj1DbYtA',
            name: 'order',
            longName: 'SortList.order',
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
