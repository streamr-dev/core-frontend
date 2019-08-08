/* eslint-disable max-len */
import moduleDescription from './Expression-567.md'

export default {
    id: 567,
    name: 'Expression',
    path: 'Time Series: Simple Math',
    help: {
        params: {
            expression: 'mathematical expression to evaluate',
        },
        paramNames: [
            'expression',
        ],
        inputs: {
            x: 'variable for default expression',
            y: 'variable for default expression',
        },
        inputNames: [
            'x',
            'y',
        ],
        outputs: {
            out: 'result if evaluation succeeded',
            error: 'error message if evaluation failed (e.g. syntax error in expression)',
        },
        outputNames: [
            'out',
            'error',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_RHCa4R18QyKC_XM648Aegw',
            name: 'x',
            longName: 'Expression.x',
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
        {
            id: 'ep_tnt_pb_IS3COUMv01bXvGA',
            name: 'y',
            longName: 'Expression.y',
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
            id: 'ep_NS8aAxftSqGLJwLc9VUgyg',
            name: 'out',
            longName: 'Expression.out',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_mEqmrZ6mS720tfPKQldwgQ',
            name: 'error',
            longName: 'Expression.error',
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
            id: 'ep_wFy-VZbnRMWiWOUBkC-YSQ',
            name: 'expression',
            longName: 'Expression.expression',
            type: 'String',
            connected: false,
            canConnect: false,
            export: false,
            value: 'x+y',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'x+y',
            updateOnChange: true,
            isTextArea: false,
        },
    ],
}
