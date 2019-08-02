/* eslint-disable max-len */
import moduleDescription from './ConstantText-19.md'

export default {
    id: 19,
    name: 'ConstantText',
    path: 'Text',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {
            str: 'The text constant',
        },
        outputs: {
            out: 'Outputs the text constant',
        },
        paramNames: [
            'str',
        ],
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_tpHdDGM8RMmezbm8dc1cYg',
            name: 'out',
            longName: 'ConstantText.out',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'STR',
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_r8Fbn3OGS5WDgSGltIUf3A',
            name: 'str',
            longName: 'ConstantText.str',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'STR',
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'STR',
            isTextArea: false,
        },
    ],
}
