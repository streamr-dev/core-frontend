/* eslint-disable max-len */
import moduleDescription from './Not-32.md'

export default {
    id: 32,
    name: 'Not',
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
            id: 'ep_vGZlKoH7Q1WzMVWECEscIA',
            name: 'in',
            longName: 'Not.in',
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
            id: 'ep_hJuKDcM2R7CKrrUan_m8Hg',
            name: 'out',
            longName: 'Not.out',
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
