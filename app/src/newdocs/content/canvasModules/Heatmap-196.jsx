/* eslint-disable max-len */
import moduleDescription from './Heatmap-196.md'

export default {
    id: 196,
    name: 'Heatmap',
    path: 'Visualizations',
    help: {
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_C4DLng2QTgW-c_HEnQ-w4g',
            name: 'latitude',
            longName: 'Heatmap.latitude',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: false,
        },
        {
            id: 'ep_x6iEZ4k-Tuy4DddFA4jAZQ',
            name: 'longitude',
            longName: 'Heatmap.longitude',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: false,
        },
        {
            id: 'ep_DMWNuR3iRtm7kAkCnsNI0g',
            name: 'value',
            longName: 'Heatmap.value',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: false,
        },
    ],
    outputs: [],
    params: [],
}
