/* eslint-disable max-len */
import moduleDescription from './StringTemplate-1015.md'

export default {
    id: 1015,
    name: 'StringTemplate',
    path: 'Text',
    help: {
        params: {
            template: 'Text template',
        },
        paramNames: [
            'template',
        ],
        inputs: {
            args: 'Map of arguments that will be substituted into the template',
        },
        inputNames: [
            'args',
        ],
        outputs: {
            errors: 'List of error strings',
            result: 'Completed template string',
        },
        outputNames: [
            'errors',
            'result',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_p1oisrwmSjm6MOqDRC5VeA',
            name: 'args',
            longName: 'StringTemplate.args',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Map',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_a5b7VHz_TF-AqupDrAvryQ',
            name: 'errors',
            longName: 'StringTemplate.errors',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
        {
            id: 'ep_W4b-ClylR8qE_FmKWzFYvg',
            name: 'result',
            longName: 'StringTemplate.result',
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
            id: 'ep_8IddtlzoSlOsg98Fxhc4Sw',
            name: 'template',
            longName: 'StringTemplate.template',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '',
            isTextArea: true,
        },
    ],
}
