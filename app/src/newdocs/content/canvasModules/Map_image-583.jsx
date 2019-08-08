/* eslint-disable max-len */
import moduleDescription from './Map_image-583.md'

export default {
    id: 583,
    name: 'Map (image)',
    path: 'Visualizations',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            id: 'Id of the marker to draw',
            x: 'Horizontal coordinate of the marker between 0 and 1',
            y: 'Vertical coordinate of the marker between 0 and 1',
        },
        inputNames: [
            'id',
            'x',
            'y',
        ],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_5R6f7lFxRM2fpZtXghNpyQ',
            name: 'id',
            longName: 'Map (image).id',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            value: 'id',
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: false,
        },
        {
            id: 'ep_8r6JeN5nR5GkdpXI6_y_Mg',
            name: 'x',
            longName: 'Map (image).x',
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
            canHaveInitialValue: false,
        },
        {
            id: 'ep_yrXwMjMzTm2NCpKkXTe-Ng',
            name: 'y',
            longName: 'Map (image).y',
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
            canHaveInitialValue: false,
        },
    ],
    outputs: [],
    params: [],
}
