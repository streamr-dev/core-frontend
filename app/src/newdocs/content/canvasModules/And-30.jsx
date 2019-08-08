/* eslint-disable max-len */
import moduleDescription from './And-30.md'

export default {
    id: 30,
    name: 'And',
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
            id: 'ep_SQVgR_MYTjmtuoNftEgWWQ',
            name: 'A',
            longName: 'And.A',
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
            id: 'ep_8AcOOVTiRAWJgocOlJjaSg',
            name: 'B',
            longName: 'And.B',
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
            id: 'ep_5rWghOHTQViDYbd8aPoS5w',
            name: 'out',
            longName: 'And.out',
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
