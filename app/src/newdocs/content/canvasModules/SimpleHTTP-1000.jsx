/* eslint-disable max-len */
import moduleDescription from './SimpleHTTP-1000.md'

export default {
    id: 1000,
    name: 'Simple HTTP',
    path: 'Integrations',
    help: {
        code: 'FORBIDDEN',
        resource: 'ModulePackage',
        fault: 'operation',
        id: '5',
        message: 'Non-authenticated user does not have permission to read ModulePackage (id 5)',
        user: '<not authenticated>',
        operation: 'read',
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_Hn7FK2TpRgCfCpixXx1lWA',
            name: 'trigger',
            longName: 'Simple HTTP.trigger',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'Object',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_NEv-eT7GSR-3rIUmlB5XSw',
            name: 'errors',
            longName: 'Simple HTTP.errors',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_tWDWRkPOQCC9LX5XsX1IOg',
            name: 'verb',
            longName: 'Simple HTTP.verb',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'POST',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'GET',
                    value: 'GET',
                },
                {
                    name: 'POST',
                    value: 'POST',
                },
                {
                    name: 'PUT',
                    value: 'PUT',
                },
                {
                    name: 'DELETE',
                    value: 'DELETE',
                },
                {
                    name: 'PATCH',
                    value: 'PATCH',
                },
            ],
            defaultValue: 'POST',
            isTextArea: false,
        },
        {
            id: 'ep_YTLElfyQQhuTeva28z0KLg',
            name: 'URL',
            longName: 'Simple HTTP.URL',
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
