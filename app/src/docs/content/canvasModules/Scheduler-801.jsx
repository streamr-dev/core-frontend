/* eslint-disable max-len */
import moduleDescription from './Scheduler-801.md'

export default {
    id: 801,
    name: 'Scheduler',
    path: 'Time & Date',
    help: {
        params: {},
        paramNames: [],
        inputs: {},
        inputNames: [],
        outputs: {
            value: 'The value from a active rule or the default value',
        },
        outputNames: [
            'value',
        ],
        helpText: moduleDescription,
    },
    inputs: [],
    outputs: [
        {
            id: 'ep_8nkptLaFT2CS0PmMSau_AA',
            name: 'value',
            longName: 'Scheduler.value',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [],
}
