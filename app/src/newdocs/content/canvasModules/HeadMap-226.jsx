/* eslint-disable max-len */
import moduleDescription from './HeadMap-226.md'

export default {
    id: 226,
    name: 'HeadMap',
    path: 'Map',
    help: {
        params: {
            limit: 'the number of entries to fetch',
        },
        paramNames: [
            'limit',
        ],
        inputs: {
            in: 'a map',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'a submap of the first entries of map',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_eePBgy14RSCVZ8CX-s5Bew',
            name: 'in',
            longName: 'HeadMap.in',
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
            id: 'ep_QwbkB7iSR_KiLt_Fd6A3Fg',
            name: 'out',
            longName: 'HeadMap.out',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_45Y-EFiJRvCZkyq_OSoTyA',
            name: 'limit',
            longName: 'HeadMap.limit',
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
