/* eslint-disable max-len */
import moduleDescription from './BooleanToNumber-1002.md'

export default {
    id: 1002,
    name: 'BooleanToNumber',
    path: 'Boolean',
    help: {
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_fekljL3VRGC7_T9ARPzJ4Q',
            name: 'in',
            longName: 'BooleanToNumber.in',
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
            id: 'ep_ghm8Eh9yQAO6SpQK-V09rQ',
            name: 'out',
            longName: 'BooleanToNumber.out',
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
