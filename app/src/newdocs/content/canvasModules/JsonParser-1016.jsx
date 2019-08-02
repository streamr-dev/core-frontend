/* eslint-disable max-len */
import moduleDescription from './JsonParser-1016.md'

export default {
    id: 1016,
    name: 'JsonParser',
    path: 'Text',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            json: 'JSON string to parse',
        },
        inputNames: [
            'json',
        ],
        outputs: {
            errors: 'List of error strings',
            result: 'Map, List or value that the JSON string represents',
        },
        outputNames: [
            'errors',
            'result',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_ca8TRKlNSDKqvu3Vv0TRiA',
            name: 'json',
            longName: 'JsonParser.json',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_IQ_XjGyIQ_icIjlKr5aDrw',
            name: 'errors',
            longName: 'JsonParser.errors',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
        {
            id: 'ep_-aWBXw4HQXyndzmJkjx7sw',
            name: 'result',
            longName: 'JsonParser.result',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
