/* eslint-disable max-len */
import moduleDescription from './Xor-573.md'

export default {
    id: 573,
    name: 'Xor',
    path: 'Boolean',
    help: {
        params: {},
        paramNames: [],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_K5Q6mEcrTj2JlVacYhZYSQ',
            name: 'A',
            longName: 'Xor.A',
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
            id: 'ep_QZpITA7ATB2dhzJToHxccw',
            name: 'B',
            longName: 'Xor.B',
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
            id: 'ep_y7082lLSSfOVGqPyy7amIA',
            name: 'out',
            longName: 'Xor.out',
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
