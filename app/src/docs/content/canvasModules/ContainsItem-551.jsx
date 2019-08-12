/* eslint-disable max-len */
import moduleDescription from './ContainsItem-551.md'

export default {
    id: 551,
    name: 'ContainsItem',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            item: 'item to look for',
            list: 'list to look from',
        },
        inputNames: [
            'item',
            'list',
        ],
        outputs: {
            found: 'true if found; false otherwise',
        },
        outputNames: [
            'found',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_lZCITP3oQgerk1lN4V0KbQ',
            name: 'item',
            longName: 'ContainsItem.item',
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
            id: 'ep_SSo-4fXaQgOFCghMBFj9dw',
            name: 'list',
            longName: 'ContainsItem.list',
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
            id: 'ep_Z2ApxEZeSSaNaIyCFOr-Eg',
            name: 'found',
            longName: 'ContainsItem.found',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
