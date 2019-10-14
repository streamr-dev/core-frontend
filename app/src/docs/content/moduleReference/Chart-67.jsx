/* eslint-disable max-len */
import moduleDescription from './Chart-67.md'

export default {
    id: 67,
    name: 'Chart',
    path: 'Visualizations',
    jsModule: 'ChartModule',
    help: {
        params: {},
        paramNames: [],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    layout: {
        width: '300px',
        position: {
            top: '0px',
            left: '0px',
        },
        height: '341px',
    },
    inputs: [
        {
            canToggleDrivingInput: false,
            drivingInput: true,
            type: 'Double',
            connected: false,
            yAxis: 0,
            requiresConnection: false,
            name: 'in1',
            canConnect: true,
            id: '16d5ec2d-3b72-4131-88be-10909b4a45ca',
            acceptedTypes: [
                'Double',
            ],
            canHaveInitialValue: false,
            export: false,
            longName: 'Chart.in1',
        },
        {
            canToggleDrivingInput: false,
            drivingInput: true,
            type: 'Double',
            connected: false,
            yAxis: 0,
            requiresConnection: false,
            name: 'in2',
            canConnect: true,
            id: '3ea51731-4d28-42b1-b8de-53708f386ba9',
            acceptedTypes: [
                'Double',
            ],
            canHaveInitialValue: false,
            export: false,
            longName: 'Chart.in2',
        },
    ],
    outputs: [],
    params: [],
}
