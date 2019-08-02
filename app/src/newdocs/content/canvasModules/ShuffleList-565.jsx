/* eslint-disable max-len */
import moduleDescription from './ShuffleList-565.md'

export default {
    id: 565,
    name: 'ShuffleList',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {
            in: 'input list',
        },
        inputNames: [
            'in',
        ],
        outputs: {
            out: 'input list randomly ordered',
        },
        outputNames: [
            'out',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_stwbeBLlT7WxJ5FGHwdxpQ',
            name: 'in',
            longName: 'ShuffleList.in',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'List',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_Erve-cxRTB6nxqVl0FuVPw',
            name: 'out',
            longName: 'ShuffleList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [],
}
