/* eslint-disable max-len */
import moduleDescription from './MapSize-235.md'

export default {
    id: 235,
    name: 'MapSize',
    path: 'Map',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'a map',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            size: 'the number of entries',
        },
        outputNames: [
            'size',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_FsHo_0T6R_Of4revvO5rSw',
            name: 'in',
            longName: 'MapSize.in',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Map',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_dHu1ZsorRGKgBGBxeJdW-g',
            name: 'size',
            longName: 'MapSize.size',
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
