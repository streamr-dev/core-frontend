/* eslint-disable max-len */
import moduleDescription from './ARIMA-98.md'

export default {
    id: 98,
    name: 'ARIMA',
    path: 'Time Series: Prediction',
    help: {
        outputNames: [
            'pred',
        ],
        inputs: {
            in: 'Incoming time series',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {},
        outputs: {
            pred: 'ARIMA prediction',
        },
        paramNames: [],
    },
    inputs: [
        {
            id: 'ep_9TRJKLDkQtuhC1AQQEmcYg',
            name: 'in',
            longName: 'ARIMA.in',
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
            id: 'ep_gMAcMVLUTeyLK7oVDG9Deg',
            name: 'pred',
            longName: 'ARIMA.pred',
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
