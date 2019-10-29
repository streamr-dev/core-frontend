/* eslint-disable max-len */
import moduleDescription from './Scheduler-801.md'

export default {
    id: 801,
    name: 'Scheduler',
    path: 'Time & Date',
    jsModule: 'SchedulerModule',
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
    params: [
        {
            id: 'e51da7e8-84d5-4f9b-8b38-e74a7138d910',
            name: 'timezone',
            longName: 'Scheduler.timezone',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'UTC',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'UTC',
        },
    ],
    schedule: {
        defaultValue: 0,
        rules: [],
    },
}
