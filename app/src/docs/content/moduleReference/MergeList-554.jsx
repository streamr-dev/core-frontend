/* eslint-disable max-len */
import moduleDescription from './MergeList-554.md'

export default {
    id: 554,
    name: 'MergeList',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            head: 'the first items of the merged list',
            tail: 'the last items of the merged list',
        },
        inputNames: [
            'head',
            'tail',
        ],
        outputs: {
            out: 'merged list',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_N8Pk_Kr4ScG36-T9Rwzong',
            name: 'head',
            longName: 'MergeList.head',
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
        {
            id: 'ep_SeJGOpFxRBGdW7pnlg1XZg',
            name: 'tail',
            longName: 'MergeList.tail',
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
            id: 'ep_XrW3HFKXQXyCzsSiDaGodQ',
            name: 'out',
            longName: 'MergeList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
