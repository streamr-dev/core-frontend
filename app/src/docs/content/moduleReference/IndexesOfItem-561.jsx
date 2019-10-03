/* eslint-disable max-len */
import moduleDescription from './IndexesOfItem-561.md'

export default {
    id: 561,
    name: 'IndexesOfItem',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            item: 'item to look for',
            list: 'item to look for',
        },
        inputNames: [
            'item',
            'list',
        ],
        outputs: {
            indexes: 'list of indexes of occurrences; empty list if none',
        },
        outputNames: [
            'indexes',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_8KKXEdIkR5uMn0piOSz_4Q',
            name: 'item',
            longName: 'IndexesOfItem.item',
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
        {
            id: 'ep_zW92iPd8Sk-t7-8Zu2n4Ag',
            name: 'list',
            longName: 'IndexesOfItem.list',
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
            id: 'ep_IAUrlmbETNeehdAVx0qGHQ',
            name: 'indexes',
            longName: 'IndexesOfItem.indexes',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
