/* eslint-disable max-len */
import moduleDescription from './BinaryBetting-1101.md'

export default {
    id: 1101,
    name: 'BinaryBetting',
    path: 'Integrations: Ethereum',
    help: {
        helpText: moduleDescription,
    },
    jsModule: 'SolidityModule',
    inputs: [],
    outputs: [],
    params: [
        {
            id: 'ep_oIfSaRt-Rx2MLLB-cicMkA',
            name: 'ethAccount',
            longName: 'BinaryBetting.ethAccount',
            type: 'String',
            connected: false,
            canConnect: false,
            export: false,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: '(none)',
                    value: null,
                },
            ],
            defaultValue: null,
            value: null,
            updateOnChange: true,
        },
    ],
}
