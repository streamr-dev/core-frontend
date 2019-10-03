/* eslint-disable max-len */
import moduleDescription from './RemoveFromList-555.md'

export default {
    id: 555,
    name: 'RemoveFromList',
    path: 'List',
    help: {
        params: {
            index: 'position to remove item from',
        },
        paramNames: [
            'index',
        ],
        inputs: {
            in: 'list to remove item from',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'the list with the item removed',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_0Fe-dZQkTxG4zHXMRvVR2w',
            name: 'in',
            longName: 'RemoveFromList.in',
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
            id: 'ep_zqop0bvWRDyw_cpVnSE4hQ',
            name: 'out',
            longName: 'RemoveFromList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_K1u1C-8zQMGfKicI4i08Tw',
            name: 'index',
            longName: 'RemoveFromList.index',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 0,
        },
    ],
}
