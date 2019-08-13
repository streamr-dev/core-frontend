/* eslint-disable max-len */
import moduleDescription from './MergeMap-233.md'

export default {
    id: 233,
    name: 'MergeMap',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            leftMap: 'a map to merge onto',
            rightMap: 'a map to be merged',
        },
        inputNames: [
            'leftMap',
            'rightMap',
        ],
        outputs: {
            out: 'the resulting merged map',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_rJBFUr3-RMSMQZe5r1fk-g',
            name: 'leftMap',
            longName: 'MergeMap.leftMap',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Map',
            ],
            requiresConnection: true,
        },
        {
            id: 'ep_eiXO1Pd-QGCrnD9G8eKyhA',
            name: 'rightMap',
            longName: 'MergeMap.rightMap',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Map',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_jugoslxbRpaNzbDl69Obww',
            name: 'out',
            longName: 'MergeMap.out',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
