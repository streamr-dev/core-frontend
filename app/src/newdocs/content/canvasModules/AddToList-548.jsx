/* eslint-disable max-len */
import moduleDescription from './AddToList-548.md'

export default {
    id: 548,
    name: 'AddToList',
    path: 'List',
    help: {
        params: {
            index: 'index to add to, from 0 to length of list',
        },
        paramNames: [
            'index',
        ],
        inputs: {
            item: 'item to add to list',
            list: 'the list to add to',
        },
        inputNames: [
            'item',
            'list',
        ],
        outputs: {
            error: 'error string if given invalid index',
            list: 'the result if operation successful',
        },
        outputNames: [
            'error',
            'list',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_g-9HvI5dQZmBWFvPjd7HEA',
            name: 'item',
            longName: 'AddToList.item',
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
            id: 'ep_9I0_QiGcSiai8c36rxYXrA',
            name: 'list',
            longName: 'AddToList.list',
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
            id: 'ep_Sg2ylgh3S268lnoHL_L7IA',
            name: 'error',
            longName: 'AddToList.error',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_p8y7WLpPSOmvNfWFtkSVIg',
            name: 'list',
            longName: 'AddToList.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_01m1Ola6QfOkgSSKExnOAA',
            name: 'index',
            longName: 'AddToList.index',
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
