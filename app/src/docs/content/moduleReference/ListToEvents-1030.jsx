/* eslint-disable max-len */
import moduleDescription from './ListToEvents-1030.md'

export default {
    id: 1030,
    name: 'ListToEvents',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            list: 'input list',
        },
        inputNames: [
            'list',
        ],
        outputs: {
            item: 'input list items one by one as separate events',
        },
        outputNames: [
            'item',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_607i2pWcQ9ClhPF67QFkcg',
            name: 'list',
            longName: 'ListToEvents.list',
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
            id: 'ep_gGzrVh7iTlWJYXnYUJCxRQ',
            name: 'item',
            longName: 'ListToEvents.item',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
