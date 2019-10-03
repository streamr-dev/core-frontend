/* eslint-disable max-len */
import moduleDescription from './GetFromList-1012.md'

export default {
    id: 1012,
    name: 'GetFromList',
    path: 'List',
    help: {
        params: {
            index: 'Index in the list for the item to be fetched. Negative index counts from end of list.',
        },
        paramNames: [
            'index',
        ],
        inputs: {
            in: 'List to be indexed',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'Item found at given index',
            error: 'Error message, e.g. *List is empty*',
        },
        outputNames: [
            'out',
            'error',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_d2X1qCFeRMCPqJtn0DTYWg',
            name: 'in',
            longName: 'GetFromList.in',
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
            id: 'ep_irTPPw_SRJSstrPEpaBg6Q',
            name: 'error',
            longName: 'GetFromList.error',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_lG229Vd2ThKoOT_AKcTcaw',
            name: 'out',
            longName: 'GetFromList.out',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_ne6ZGlulTJS-9fsntBk7wg',
            name: 'index',
            longName: 'GetFromList.index',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 0,
        },
    ],
}
