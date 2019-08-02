/* eslint-disable max-len */
import moduleDescription from './ForEach-223.md'

export default {
    id: 223,
    name: 'ForEach',
    path: 'Map',
    help: {
        params: {
            canvas: 'The "sub" canvas that implements the ForEach-loop "body"',
        },
        paramNames: [
            'canvas',
        ],
        inputs: {
            key: 'Differentiate between canvas',
        },
        inputNames: [
            'key',
        ],
        outputs: {
            map: 'The state of outputs of all distinct Canvases by key.',
        },
        outputNames: [
            'map',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_TlwZGBFCTQ2oVu9P7-w97w',
            name: 'key',
            longName: 'ForEach.key',
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
            id: 'ep_zyIV-xfZQeiQvuPWP5N3jg',
            name: 'key',
            longName: 'ForEach.key',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_69FTNS1eTTO7MIQSkXwp8A',
            name: 'map',
            longName: 'ForEach.map',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_GqGt__m3Q8yyIeTZ-792EA',
            name: 'canvas',
            longName: 'ForEach.canvas',
            type: 'String',
            connected: false,
            canConnect: false,
            export: false,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: null,
            value: null,
            updateOnChange: true,
            isTextArea: false,
            possibleValues: [
                {
                    value: null,
                    name: 'Select >>',
                },
                {
                    value: 'eyescpGFRiKzr9WxU2k0Yw',
                    name: 'SubCanvasSpec-top',
                },
                {
                    value: 'VWo3BDECTASlAdtZk7QeeQ',
                    name: 'SubCanvasSpec-sub',
                },
            ],
        },
    ],
}
