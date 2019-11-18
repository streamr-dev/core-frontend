/* eslint-disable max-len */
import moduleDescription from './Email-195.md'

export default {
    id: 195,
    name: 'Email',
    path: 'Utils',
    help: {
        params: {
            subject: 'Email Subject',
            message: 'Custom message to include in the email, optional',
        },
        paramNames: [
            'subject',
            'message',
        ],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_kDE_pgrqSCyAT_1Yfm1Dww',
            name: 'value1',
            longName: 'Email.value1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [],
    params: [
        {
            id: 'ep_nf86xFdCQ_KjDMC15fh1Fg',
            name: 'subject',
            longName: 'Email.subject',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '',
            isTextArea: false,
        },
        {
            id: 'ep_V0H_5RYBS2SygfaK8sukMQ',
            name: 'message',
            longName: 'Email.message',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: '',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '',
            isTextArea: false,
        },
    ],
}
