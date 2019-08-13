/* eslint-disable max-len */
import moduleDescription from './StringToNumber-1031.md'

export default {
    id: 1031,
    name: 'StringToNumber',
    path: 'Text',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'input string',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'number parsed from input string',
            error: "Error if input can't be parsed",
        },
        outputNames: [
            'out',
            'error',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_EjsRuRUsTD-YENPK1lyAew',
            name: 'in',
            longName: 'StringToNumber.in',
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
            id: 'ep_xG7clUb0RcWgRuPv52WEew',
            name: 'error',
            longName: 'StringToNumber.error',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_YKaRK_k6SYSvH6ExbTgArg',
            name: 'out',
            longName: 'StringToNumber.out',
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
