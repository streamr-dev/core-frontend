/* eslint-disable max-len */
import moduleDescription from './ConstantColor-215.md'

export default {
    id: 215,
    name: 'ConstantColor',
    path: 'Utils',
    help: {
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_yq_1QANPQzyMwCO0Xpc6MA',
            name: 'color',
            longName: 'ConstantColor.color',
            type: 'Color',
            connected: false,
            canConnect: true,
            export: false,
            value: {
                alpha: 1,
                blue: 0,
                class: 'com.unifina.utils.StreamrColor',
                green: 0,
                red: 0,
            },
        },
    ],
    params: [
        {
            id: 'ep_GASyYB7TQcGzzGhndkXEVA',
            name: 'value',
            longName: 'ConstantColor.value',
            type: 'Color',
            connected: false,
            canConnect: true,
            export: false,
            value: 'rgba(0, 0, 0, 1.0)',
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Color',
            ],
            requiresConnection: false,
            defaultValue: 'rgba(0, 0, 0, 1.0)',
        },
    ],
}
