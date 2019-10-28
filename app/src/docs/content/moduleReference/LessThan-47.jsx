/* eslint-disable max-len */
import moduleDescription from './LessThan-47.md'

export default {
    id: 47,
    name: 'LessThan',
    path: 'Boolean',
    help: {
        outputNames: [],
        inputs: {},
        helpText: moduleDescription,
        inputNames: [],
        params: {},
        outputs: {},
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_ZkCs1cIUT6SiwNRWSXMxaQ',
            name: 'A',
            longName: 'LessThan.A',
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
            id: 'ep_QJwZt87lSFOKavOUye41aw',
            name: 'B',
            longName: 'LessThan.B',
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
            id: 'ep_-UFx7EGzRD6ffpAcUM1QWw',
            name: 'A<B',
            longName: 'LessThan.A<B',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_lzF_FD_eQsWBkVZyn_I93A',
            name: 'equality',
            longName: 'LessThan.equality',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            value: false,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Boolean',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'false',
                    value: 'false',
                },
                {
                    name: 'true',
                    value: 'true',
                },
            ],
            defaultValue: false,
        },
    ],
}
