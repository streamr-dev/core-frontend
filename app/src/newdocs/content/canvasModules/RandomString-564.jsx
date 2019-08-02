/* eslint-disable max-len */
import moduleDescription from './RandomString-564.md'

export default {
    id: 564,
    name: 'RandomString',
    path: 'Text',
    help: {
        params: {
            length: 'length of strings to generate',
        },
        paramNames: [
            'length',
        ],
        inputs: {
            trigger: 'when value is received, activates module',
        },
        inputNames: [
            'trigger',
        ],
        outputs: {
            out: 'the random string',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_mMrnxuQfS7K8bVNJvLcoIA',
            name: 'trigger',
            longName: 'RandomString.trigger',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_2feX05QYTBKnjp7o8Gi7Cw',
            name: 'out',
            longName: 'RandomString.out',
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
            id: 'ep_ZutoP-J5Rx-lX-sKjsby5Q',
            name: 'length',
            longName: 'RandomString.length',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 10,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 10,
        },
    ],
}
