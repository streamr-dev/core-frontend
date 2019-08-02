/* eslint-disable max-len */
import moduleDescription from './CountByKey-221.md'

export default {
    id: 221,
    name: 'CountByKey',
    path: 'Map',
    help: {
        params: {
            sort: 'Whether key-count pairs should be order by count',
            maxKeyCount: 'Maximum number of (sorted) key-count pairs to keep. Everything else will be dropped.',
        },
        paramNames: [
            'sort',
            'maxKeyCount',
        ],
        inputs: {
            key: 'The (string) key',
        },
        inputNames: [
            'key',
        ],
        outputs: {
            map: 'Key-count pairs',
            valueOfCurrentKey: 'The occurrence count of the last key received. ',
        },
        outputNames: [
            'map',
            'valueOfCurrentKey',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_FFjksvg6TLyZJLElXLQFKw',
            name: 'key',
            longName: 'CountByKey.key',
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
            id: 'ep_eYHrwwCxRL6Nj-8Xb90lAg',
            name: 'map',
            longName: 'CountByKey.map',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_jA7lBOO5Tl2s59z5qAt2ow',
            name: 'windowLength',
            longName: 'CountByKey.windowLength',
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
        {
            id: 'ep_sCkC32IlTgi0Sxh8748Otg',
            name: 'windowType',
            longName: 'CountByKey.windowType',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'events',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'events',
            isTextArea: false,
            possibleValues: [
                {
                    name: 'events',
                    value: 'EVENTS',
                },
                {
                    name: 'seconds',
                    value: 'SECONDS',
                },
                {
                    name: 'minutes',
                    value: 'MINUTES',
                },
                {
                    name: 'hours',
                    value: 'HOURS',
                },
                {
                    name: 'days',
                    value: 'DAYS',
                },
            ],
        },
        {
            id: 'ep_wUGunatITaGjOm_LMvOlAQ',
            name: 'maxKeyCount',
            longName: 'CountByKey.maxKeyCount',
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
