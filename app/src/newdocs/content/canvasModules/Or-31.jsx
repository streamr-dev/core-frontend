/* eslint-disable max-len */
import moduleDescription from './Or-31.md'

export default {
    id: 31,
    name: 'Or',
    path: 'Boolean',
    help: {
        outputNames: [],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {},
        outputs: {},
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_qzeA5CdHTpqdcd0WOf1uqA',
            name: 'A',
            longName: 'Or.A',
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
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_xJlO4DX3RDqrsw7e1hQVFQ',
            name: 'B',
            longName: 'Or.B',
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
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_FKrietY6R4-fXJLW1pEWUQ',
            name: 'out',
            longName: 'Or.out',
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
