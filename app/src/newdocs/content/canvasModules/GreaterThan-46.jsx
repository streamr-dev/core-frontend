/* eslint-disable max-len */
import moduleDescription from './GreaterThan-46.md'

export default {
    id: 46,
    name: 'GreaterThan',
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
            id: 'ep_AYWYf5McTqmEdKhVvAorvQ',
            name: 'A',
            longName: 'GreaterThan.A',
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
            id: 'ep_d-kHw8iCSeKbJGqPOhvC1Q',
            name: 'B',
            longName: 'GreaterThan.B',
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
            id: 'ep_1vxo7cDNT9Ws_CeInUwffA',
            name: 'A&gt;B',
            longName: 'GreaterThan.A&gt;B',
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
            id: 'ep_5iQJvnwTRO-62yXCygcQeA',
            name: 'equality',
            longName: 'GreaterThan.equality',
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
