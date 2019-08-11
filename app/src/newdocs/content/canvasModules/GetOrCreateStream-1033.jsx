/* eslint-disable max-len */
import moduleDescription from './GetOrCreateStream-1033.md'

export default {
    id: 1033,
    name: 'GetOrCreateStream',
    path: 'Streams',
    help: {
        params: {
            fields: 'the fields to be assigned to the stream if a new stream is created',
        },
        paramNames: [
            'fields',
        ],
        inputs: {
            name: 'name of the stream',
            description: 'human-readable description if a new stream is created',
        },
        inputNames: [
            'name',
            'description',
        ],
        outputs: {
            created: 'true if stream was created, false if existing stream was found',
            stream: 'the id of the found or created stream',
        },
        outputNames: [
            'created',
            'stream',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_jplglc8fSsasZu08jF-0cw',
            name: 'name',
            longName: 'GetOrCreateStream.name',
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
        {
            id: 'ep_Ht7MHBpVTeG_LTUU4xwCfw',
            name: 'description',
            longName: 'GetOrCreateStream.description',
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
            id: 'ep_eEu1CIIkRVSpvL5vhmHoUA',
            name: 'created',
            longName: 'GetOrCreateStream.created',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_9HVhDXzwRiGBItjBDcDrVw',
            name: 'stream',
            longName: 'GetOrCreateStream.stream',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_Kqh2bMmWSG21K8DX0ihTSQ',
            name: 'fields',
            longName: 'GetOrCreateStream.fields',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            value: {},
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Map',
            ],
            requiresConnection: false,
            defaultValue: {},
        },
    ],
}
