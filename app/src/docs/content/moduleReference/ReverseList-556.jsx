/* eslint-disable max-len */
import moduleDescription from './ReverseList-556.md'

export default {
    id: 556,
    name: 'ReverseList',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'list',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'reversed list',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_nK1NmI-zQMCGt1IWNiPHSg',
            name: 'in',
            longName: 'ReverseList.in',
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
            id: 'ep_eh5LCnMfQtWGc8k0l9z3sw',
            name: 'out',
            longName: 'ReverseList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
