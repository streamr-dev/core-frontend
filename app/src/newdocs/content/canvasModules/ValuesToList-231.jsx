/* eslint-disable max-len */
import moduleDescription from './ValuesToList-231.md'

export default {
    id: 231,
    name: 'ValuesToList',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'a map',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            keys: 'values as a list',
        },
        outputNames: [
            'keys',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_NErliqJ6STKKJDbaXrMQrw',
            name: 'in',
            longName: 'ValuesToList.in',
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
            id: 'ep_fA3HtsldQkmxE4O6Cgc2-Q',
            name: 'keys',
            longName: 'ValuesToList.keys',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
