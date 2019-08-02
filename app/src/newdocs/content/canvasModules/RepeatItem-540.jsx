/* eslint-disable max-len */
import moduleDescription from './RepeatItem-540.md'

export default {
    id: 540,
    name: 'RepeatItem',
    path: 'List',
    help: {
        params: {
            times: 'times to repeat the item',
        },
        paramNames: [
            'times',
        ],
        inputs: {
            item: 'item to be repeated',
        },
        inputNames: [
            'item',
        ],
        outputs: {
            list: 'the produced list',
        },
        outputNames: [
            'list',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_Hi1m4uCTQseAMwOteyJjAg',
            name: 'item',
            longName: 'RepeatItem.item',
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
    ],
    outputs: [
        {
            id: 'ep_Se53jQfkSMC5SWg5TGPPHg',
            name: 'list',
            longName: 'RepeatItem.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_cnprlN3sSR-eHMgmgoVfOA',
            name: 'times',
            longName: 'RepeatItem.times',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 10,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 10,
        },
    ],
}
