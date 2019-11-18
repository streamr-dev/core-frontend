/* eslint-disable max-len */
import moduleDescription from './BooleanConstant-1003.md'

export default {
    id: 1003,
    name: 'BooleanConstant',
    path: 'Boolean',
    help: {
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_dcmnN8t7TVqQqbgG9IiF0g',
            name: 'out',
            longName: 'BooleanConstant.out',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            value: true,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_nF2XrjlNQrumTBgPacsLjw',
            name: 'val',
            longName: 'BooleanConstant.val',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            value: true,
            drivingInput: true,
            canToggleDrivingInput: false,
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
            defaultValue: true,
        },
    ],
}
