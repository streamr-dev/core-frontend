/* eslint-disable max-len */
import moduleDescription from './CreateStream-529.md'

export default {
    id: 529,
    name: 'CreateStream',
    path: 'Streams',
    help: {
        params: {
            fields: 'the fields to be assigned to the stream',
        },
        paramNames: [
            'fields',
        ],
        inputs: {
            name: 'name of the stream',
            description: 'human-readable description',
        },
        inputNames: [
            'name',
            'description',
        ],
        outputs: {
            created: 'true if stream was created, false if failed to create stream',
            stream: 'the id of the created stream',
        },
        outputNames: [
            'created',
            'stream',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep__sI5Ha_ERS-Nr2ayxS9rJw',
            name: 'name',
            longName: 'CreateStream.name',
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
            id: 'ep_xZKXaUe7TGasXMxFSeWrEA',
            name: 'description',
            longName: 'CreateStream.description',
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
            id: 'ep_tNU63vHjQB-Y2uhxUcaDSA',
            name: 'created',
            longName: 'CreateStream.created',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_dtwrxx2MRG6iJkX3NHof3Q',
            name: 'stream',
            longName: 'CreateStream.stream',
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
            id: 'ep_ayJm2LOjTmyTbb3OejMI2g',
            name: 'fields',
            longName: 'CreateStream.fields',
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
