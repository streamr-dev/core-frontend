/* eslint-disable max-len */
import moduleDescription from './RoundToStep-120.md'

export default {
    id: 120,
    name: 'RoundToStep',
    path: 'Time Series: Simple Math',
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
            id: 'ep_m8mWGFPDQhqodFwZ_Sys0g',
            name: 'in',
            longName: 'RoundToStep.in',
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
            id: 'ep_9PDAEBkETM29CAvjiFAs-w',
            name: 'out',
            longName: 'RoundToStep.out',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_wxAgYaQ1TLSwzyQxRNZqgg',
            name: 'precision',
            longName: 'RoundToStep.precision',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0.01,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 0.01,
        },
        {
            id: 'ep_kKhiPcbsQRaQy6I546gSlA',
            name: 'mode',
            longName: 'RoundToStep.mode',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 1,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 1,
            possibleValues: [
                {
                    name: 'up',
                    value: 1,
                },
                {
                    name: 'down',
                    value: 2,
                },
                {
                    name: 'towards zero',
                    value: 3,
                },
                {
                    name: 'away from zero',
                    value: 4,
                },
            ],
        },
    ],
}
