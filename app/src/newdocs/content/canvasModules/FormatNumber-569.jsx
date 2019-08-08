/* eslint-disable max-len */
import moduleDescription from './FormatNumber-569.md'

export default {
    id: 569,
    name: 'FormatNumber',
    path: 'Text',
    help: {
        params: {
            decimalPlaces: 'number of decimal places',
        },
        paramNames: [
            'decimalPlaces',
        ],
        inputs: {
            number: 'number to format',
        },
        inputNames: [
            'number',
        ],
        outputs: {
            text: 'number formatted as string',
        },
        outputNames: [
            'text',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_kAAeGS2FQEuXbdAh3XSEig',
            name: 'number',
            longName: 'FormatNumber.number',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_CIzE8dxVSnGkKt-IM3ARRQ',
            name: 'text',
            longName: 'FormatNumber.text',
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
            id: 'ep_Pq3EAjOZQH-S76JHDfsGag',
            name: 'decimalPlaces',
            longName: 'FormatNumber.decimalPlaces',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 0,
        },
    ],
}
