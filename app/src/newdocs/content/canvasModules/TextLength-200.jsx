/* eslint-disable max-len */
import moduleDescription from './TextLength-200.md'

export default {
    id: 200,
    name: 'TextLength',
    path: 'Text',
    help: {
        params: {},
        paramNames: [],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_MZsCxK43RSuMQNry9h9yjA',
            name: 'text',
            longName: 'TextLength.text',
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
            id: 'ep_vRzNQLcLTwi0DJqcIyofzA',
            name: 'length',
            longName: 'TextLength.length',
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
