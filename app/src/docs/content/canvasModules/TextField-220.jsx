/* eslint-disable max-len */
import moduleDescription from './TextField-220.md'

export default {
    id: 220,
    name: 'TextField',
    path: 'Input',
    jsModule: 'InputModule',
    widget: 'StreamrTextField',
    textFieldValue: '',
    layout: {
        position: {
            left: '0px',
            top: '0px',
        },
        width: '250px',
        height: '156px',
    },
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
            id: 'ep_crlxgboiTSSe_8aN9_5WCQ',
            name: 'out',
            longName: 'TextField.out',
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
