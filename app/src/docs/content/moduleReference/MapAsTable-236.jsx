/* eslint-disable max-len */
import moduleDescription from './MapAsTable-236.md'

export default {
    id: 236,
    name: 'MapAsTable',
    path: 'Utils',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            map: 'a map',
        },
        inputNames: [
            'map',
        ],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_NmfC0moXRtylVDgJ_csJUw',
            name: 'map',
            longName: 'MapAsTable.map',
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
    outputs: [],
    params: [],
}
