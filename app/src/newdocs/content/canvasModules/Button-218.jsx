/* eslint-disable max-len */
import moduleDescription from './Button-218.md'

export default {
    id: 218,
    name: 'Button',
    path: 'Input',
    help: {
        params: {
            buttonName: 'The name which the button gets',
            outputValue: 'Value which is outputted when the button is clicked',
        },
        paramNames: [
            'buttonName',
            'outputValue',
        ],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_UDO5wgimS7S_8HoBlf8zqA',
            name: 'out',
            longName: 'Button.out',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: false,
        },
    ],
    params: [
        {
            id: 'ep_DQdkcXQAQ-eBXVB15L7-8g',
            name: 'buttonName',
            longName: 'Button.buttonName',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'button',
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'button',
            isTextArea: false,
        },
        {
            id: 'ep_jeGZt2NyQBicjS9qY7sCkg',
            name: 'buttonValue',
            longName: 'Button.buttonValue',
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
