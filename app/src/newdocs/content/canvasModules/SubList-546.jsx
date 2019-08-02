/* eslint-disable max-len */
import moduleDescription from './SubList-546.md'

export default {
    id: 546,
    name: 'SubList',
    path: 'List',
    help: {
        params: {
            from: 'start position (included)',
            to: 'end position (not included)',
        },
        paramNames: [
            'from',
            'to',
        ],
        inputs: {
            in: 'input list',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            error: 'error string in case error occurred',
            out: 'extracted sub list if successful',
        },
        outputNames: [
            'error',
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_dgiWf_f_Td6Jnhd6OO5Wow',
            name: 'in',
            longName: 'SubList.in',
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
            id: 'ep_MWG-7dQkSe2iY6QBAhEsAQ',
            name: 'error',
            longName: 'SubList.error',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_4zJQj4BvQNitshYfI4Xd_A',
            name: 'out',
            longName: 'SubList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep__Zo8mAYRRyKDWOXnYGDjqQ',
            name: 'from',
            longName: 'SubList.from',
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
        {
            id: 'ep_aN2lOGN6TeuGaaCdi83ZEQ',
            name: 'to',
            longName: 'SubList.to',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 1,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 1,
        },
    ],
}
