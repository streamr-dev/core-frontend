/* eslint-disable max-len */
import moduleDescription from './ListSize-544.md'

export default {
    id: 544,
    name: 'ListSize',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'input list',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            size: 'number of items in list',
        },
        outputNames: [
            'size',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_43XiwNUkTz-3Tl8zQOSyQA',
            name: 'in',
            longName: 'ListSize.in',
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
            id: 'ep_LTcI2zlwR6SGWWV7E83RUg',
            name: 'size',
            longName: 'ListSize.size',
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
