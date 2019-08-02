/* eslint-disable max-len */
import moduleDescription from './SampleIf-125.md'

export default {
    id: 125,
    name: 'SampleIf',
    path: 'Time Series: Triggers',
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
            id: 'ep_6G6RQkQ9SS6O6mU1zRblZQ',
            name: 'triggerIf',
            longName: 'SampleIf.triggerIf',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
        {
            id: 'ep_FPDw2vQ_S2e3uM2c7itqjA',
            name: 'value',
            longName: 'SampleIf.value',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_BvdqEhFeRSSbGoxZAZCkgg',
            name: 'value',
            longName: 'SampleIf.value',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
