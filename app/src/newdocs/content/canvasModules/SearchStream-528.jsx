/* eslint-disable max-len */
import moduleDescription from './SearchStream-528.md'

export default {
    id: 528,
    name: 'SearchStream',
    path: 'Streams',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            name: 'stream to search for by name, must be exact',
        },
        inputNames: [
            'name',
        ],
        outputs: {
            found: 'true if stream was found',
            stream: 'id of stream if found',
        },
        outputNames: [
            'found',
            'stream',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_BWWBKhA5R_i6D6330B-SOQ',
            name: 'name',
            longName: 'SearchStream.name',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_Ytmwe_NERvGCYLD20DXeIg',
            name: 'fields',
            longName: 'SearchStream.fields',
            type: 'Map',
            connected: false,
            canConnect: true,
            export: false,
        },
        {
            id: 'ep_GftBhk10TBabMoypHfpvIQ',
            name: 'found',
            longName: 'SearchStream.found',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_0eHRakDDSLud7R1fRsJDew',
            name: 'stream',
            longName: 'SearchStream.stream',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
