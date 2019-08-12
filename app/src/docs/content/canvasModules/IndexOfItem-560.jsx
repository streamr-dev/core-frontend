/* eslint-disable max-len */
import moduleDescription from './IndexOfItem-560.md'

export default {
    id: 560,
    name: 'IndexOfItem',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            item: 'item to look for',
            list: 'list to look in',
        },
        inputNames: [
            'item',
            'list',
        ],
        outputs: {
            index: 'outputs the index of the first occurrence; does not output anything if no occurrences',
        },
        outputNames: [
            'index',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_6C9drn5fRv2wZZl7t7wL-A',
            name: 'item',
            longName: 'IndexOfItem.item',
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
            id: 'ep_cUp0Jvd9TX-bmPo76OrUdQ',
            name: 'list',
            longName: 'IndexOfItem.list',
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
            id: 'ep_54owmMoIQB-FhDUM3qKf_w',
            name: 'index',
            longName: 'IndexOfItem.index',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
