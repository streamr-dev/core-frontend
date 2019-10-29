/* eslint-disable max-len */
import moduleDescription from './Sum-53.md'

export default {
    id: 53,
    name: 'Sum',
    path: 'Time Series: Simple Math',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {
            in: 'Values to be summed',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {
            minSamples: 'How many values must exist in the window before outputting a value',
            windowLength: 'Length of the sliding window of values to be summed, or 0 for infinite',
        },
        outputs: {
            out: 'Sum of values in the window',
        },
        paramNames: [
            'windowLength',
            'minSamples',
        ],
    },
    inputs: [
        {
            id: 'ep_P7qOTQzUT0yO0b7goqdE5Q',
            name: 'in',
            longName: 'Sum.in',
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
            id: 'ep_3hx3TDDcTDaKIRtL0PpHcQ',
            name: 'out',
            longName: 'Sum.out',
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
            id: 'ep_VkzBkcRnTES-iyJgJ2onIQ',
            name: 'windowLength',
            longName: 'Sum.windowLength',
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
            id: 'ep_f4t_cuchSLSI_N1fvPJfAQ',
            name: 'windowType',
            longName: 'Sum.windowType',
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
            id: 'ep_8ucu6CiySg-qhQ6jCAPnVQ',
            name: 'minSamples',
            longName: 'Sum.minSamples',
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
