/* eslint-disable max-len */
import moduleDescription from './Unique-559.md'

export default {
    id: 559,
    name: 'Unique',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            list: 'list with possible duplicates',
        },
        inputNames: [
            'list',
        ],
        outputs: {
            list: 'list without duplicates',
        },
        outputNames: [
            'list',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_UvsQB_eETA2Cb1sW66iDrA',
            name: 'list',
            longName: 'Unique.list',
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
            id: 'ep_93-jmoQrQgWYVkA_a3mupQ',
            name: 'list',
            longName: 'Unique.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
