/* eslint-disable max-len */
import moduleDescription from './TailList-558.md'

export default {
    id: 558,
    name: 'TailList',
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
            out: 'a list containing the last items of a list',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_CXlHy6YdSDCISLx-Wnt2XA',
            name: 'in',
            longName: 'TailList.in',
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
            id: 'ep_6UCRjYiBRaSen1ERVEIu9A',
            name: 'out',
            longName: 'TailList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_gt7m_nmuTtSit1xVqQ0atQ',
            name: 'limit',
            longName: 'TailList.limit',
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
