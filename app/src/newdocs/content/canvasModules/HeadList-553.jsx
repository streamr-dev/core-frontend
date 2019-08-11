/* eslint-disable max-len */
import moduleDescription from './HeadList-553.md'

export default {
    id: 553,
    name: 'HeadList',
    path: 'List',
    help: {
        params: {
            limit: 'the maximum number of items to include',
        },
        paramNames: [
            'limit',
        ],
        inputs: {
            in: 'input list',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'a list containing the first items of a list',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_BbUH44wMRB2fIz-WAQN1rw',
            name: 'in',
            longName: 'HeadList.in',
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
            id: 'ep_P_sIH2GhTd2nORxC86U6Bw',
            name: 'out',
            longName: 'HeadList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_Lx-qyV49SoGJxHL9ZHA3bA',
            name: 'limit',
            longName: 'HeadList.limit',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 50,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 50,
        },
    ],
}
