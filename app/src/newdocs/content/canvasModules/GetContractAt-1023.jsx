/* eslint-disable max-len */
import moduleDescription from './GetContractAt-1023.md'

export default {
    id: 1023,
    name: 'GetContractAt',
    path: 'Integrations: Ethereum',
    help: {
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [],
    params: [
        {
            id: 'ep_UTvm_a8yReCXCykmCBHxYg',
            name: 'address',
            longName: 'GetContractAt.address',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '0x',
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '0x',
            updateOnChange: true,
            isTextArea: false,
        },
    ],
}
