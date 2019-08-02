/* eslint-disable max-len */
import moduleDescription from './ForEachItem-539.md'

export default {
    id: 539,
    name: 'ForEachItem',
    path: 'List',
    help: {
        params: {
            keepState: 'when false, sub-canvas state is cleared after lists have been processed  ',
            canvas: 'the sub-canvas to be executed',
        },
        paramNames: [
            'keepState',
            'canvas',
        ],
        inputs: {},
        inputNames: [],
        outputs: {
            numOfItems: 'indicates how many times the sub-canvas was executed',
        },
        outputNames: [
            'numOfItems',
        ],
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [],
    params: [
        {
            id: 'ep_Kina2c18TW6aGU0DOlxXYQ',
            name: 'canvas',
            longName: 'ForEachItem.canvas',
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
            defaultValue: null,
            value: null,
            updateOnChange: true,
            isTextArea: false,
            possibleValues: [
                {
                    value: null,
                    name: 'Select >>',
                },
                {
                    value: 'eyescpGFRiKzr9WxU2k0Yw',
                    name: 'SubCanvasSpec-top',
                },
                {
                    value: 'VWo3BDECTASlAdtZk7QeeQ',
                    name: 'SubCanvasSpec-sub',
                },
            ],
        },
        {
            id: 'ep_hoVrxrCmQM-jtUYB_boV_g',
            name: 'keepState',
            longName: 'ForEachItem.keepState',
            type: 'Boolean',
            connected: false,
            canConnect: true,
            export: false,
            value: false,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Boolean',
            ],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'false',
                    value: 'false',
                },
                {
                    name: 'true',
                    value: 'true',
                },
            ],
            defaultValue: false,
        },
    ],
}
