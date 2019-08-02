/* eslint-disable max-len */
import moduleDescription from './ConstantList-802.md'

export default {
    id: 802,
    name: 'ConstantList',
    path: 'List',
    help: {
        params: {},
        paramNames: [],
        inputs: {},
        inputNames: [],
        outputs: {},
        outputNames: [],
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_O5GjCJSURj65Iob3rRfAYw',
            name: 'out',
            longName: 'ConstantList.out',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
            value: [],
        },
    ],
    params: [
        {
            id: 'ep_wxgnIlaMTiWR58fJe68jsA',
            name: 'list',
            longName: 'ConstantList.list',
            type: 'List',
            connected: false,
            canConnect: true,
            export: false,
            value: [],
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: [
                'List',
            ],
            requiresConnection: false,
            defaultValue: [],
        },
    ],
}
