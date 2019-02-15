import uuid from 'uuid'

function remapIds(items, index = {}) {
    return items.map((item) => {
        if (!index[item.id]) {
            index[item.id] = uuid()
        }

        return {
            ...item,
            id: index[item.id],
        }
    })
}

function remapModule(data, index = {}) {
    const newData = { ...data }
    if (newData.inputs) { newData.inputs = remapIds(newData.inputs, index) }
    if (newData.outputs) { newData.outputs = remapIds(newData.outputs, index) }
    if (newData.params) { newData.params = remapIds(newData.params, index) }
    return newData
}

function createMockModuleFactory(data) {
    return () => {
        const index = {}
        const newData = remapModule(data, index)
        if (newData.modules) {
            newData.modules = newData.modules.map((m) => remapModule(m, index))
        }
        return newData
    }
}

export const Table = createMockModuleFactory({
    params: [],
    inputs: [
        {
            id: 'ep_PgkxVnrySK69f9ldq5Fqsg',
            name: 'endpoint-1550217129217',
            longName: 'Table.in1',
            type: 'Object',
            connected: false,
            canConnect: true,
            export: false,
            displayName: 'in1',
            jsClass: 'VariadicInput',
            variadic: {
                isLast: true, index: 1,
            },
            drivingInput: true,
            canToggleDrivingInput: false,
            acceptedTypes: ['Object'],
            requiresConnection: false,
        },
    ],
    outputs: [],
    id: 527,
    jsModule: 'TableModule',
    type: 'module event-table-module',
    name: 'Table',
    canClearState: true,
    canRefresh: false,
    uiChannel: {
        webcomponent: 'streamr-table',
        name: 'Table',
        id: 'ofBRIwV4QRe5aiyheC94UA',
    },
    options: {
        uiResendAll: {
            value: false, type: 'boolean',
        },
        uiResendLast: {
            value: 20, type: 'int',
        },
        maxRows: {
            value: 20, type: 'int',
        },
        showOnlyNewValues: {
            value: true, type: 'boolean',
        },
    },
    tableConfig: {
        headers: ['timestamp'], title: 'Table',
    },
})

export const Clock = createMockModuleFactory({
    params: [
        {
            id: 'ep_zRT5amaGTEiCP-ZoSG0oLA',
            name: 'timezone',
            longName: 'Clock.timezone',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'UTC',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: ['String'],
            requiresConnection: false,
            defaultValue: 'UTC',
        },
        {
            id: 'ep_N6nuE4q0T7yHRlWqB8D8lw',
            name: 'format',
            longName: 'Clock.format',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'yyyy-MM-dd HH:mm:ss z',
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: ['String'],
            requiresConnection: false,
            defaultValue: 'yyyy-MM-dd HH:mm:ss z',
            isTextArea: false,
        },
        {
            id: 'ep_iMatJKzSRniXU4KDsaesKQ',
            name: 'rate',
            longName: 'Clock.rate',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 1,
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: ['Double'],
            requiresConnection: false,
            defaultValue: 1,
        },
        {
            id: 'ep_OZuffq_VQ1ioH_zmJxB5xw',
            name: 'unit',
            longName: 'Clock.unit',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'SECOND',
            drivingInput: false,
            canToggleDrivingInput: false,
            acceptedTypes: ['String'],
            requiresConnection: false,
            possibleValues: [
                {
                    name: 'second', value: 'SECOND',
                },
                {
                    name: 'minute', value: 'MINUTE',
                },
                {
                    name: 'hour', value: 'HOUR',
                },
                {
                    name: 'day', value: 'DAY',
                },
            ],
            defaultValue: 'SECOND',
        },
    ],
    inputs: [],
    outputs: [
        {
            id: 'ep_4lL-7RilToeOzECsEshtzg',
            name: 'date',
            longName: 'Clock.date',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep__KUxRdB0Tyq-THqIP9Q-Ew',
            name: 'timestamp',
            longName: 'Clock.timestamp',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    id: 209,
    jsModule: 'GenericModule',
    type: 'module',
    name: 'Clock',
    canClearState: true,
    canRefresh: false,
})

export const Canvas = createMockModuleFactory({
    params: [
        {
            id: 'ep_D9GOWidPQC6czKHFb8zhEw',
            name: 'canvas',
            longName: 'Canvas.canvas',
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
                    value: 'x7vAq9cjRvavWJj8LVg0CwTUIoOhuSSPirPQcOa_RZOg',
                    name: 'first',
                },
                {
                    value: 'ajuyRmXFSumhychAIeJ47wGn3ueg32TYaOPG047Aletw',
                    name: 'second',
                },
            ],
        },
    ],
    inputs: [],
    outputs: [],
    id: 81,
    jsModule: 'CanvasModule',
    type: 'module',
    name: 'Canvas',
    canClearState: true,
    canRefresh: true,
    uiChannel: {
        webcomponent: null,
        name: 'Notifications',
        id: 'FfZOECs6REuJtsvNgWp4uw',
    },
    options: {
        uiResendAll: {
            value: false,
            type: 'boolean',
        },
        uiResendLast: {
            value: 0,
            type: 'int',
        },
    },
    modules: [],
})

export const CanvasWithSelected = createMockModuleFactory({
    params: [
        {
            id: 'ep_D9GOWidPQC6czKHFb8zhEw',
            name: 'canvas',
            longName: 'clock with export.canvas',
            type: 'String',
            connected: false,
            canConnect: false,
            export: false,
            value: 'x7vAq9cjRvavWJj8LVg0CwTUIoOhuSSPirPQcOa_RZOg',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'x7vAq9cjRvavWJj8LVg0CwTUIoOhuSSPirPQcOa_RZOg',
            updateOnChange: true,
            isTextArea: false,
            possibleValues: [
                {
                    value: 'x7vAq9cjRvavWJj8LVg0CwTUIoOhuSSPirPQcOa_RZOg',
                    name: 'clock with export',
                },
                {
                    value: 'ajuyRmXFSumhychAIeJ47wGn3ueg32TYaOPG047Aletw',
                    name: 'button & textfield',
                },
                {
                    value: 'CvG8YRKUQs6hG5seYcSXWQeP09Vr96T9SastNczRkbOA',
                    name: 'clock with table',
                },
                {
                    value: 'KLrwEPthTQ6wJnedXD30nw2onkvnk1QEGgZ9Y0QWYW5w',
                    name: 'new button',
                },
                {
                    value: 'uyxthPNPQ_WZTmYiaeAmbggiU5ZlXBRV-ivf4PPd0J0A',
                    name: 'button',
                },
            ],
        },
    ],
    inputs: [],
    outputs: [
        {
            id: 'xJ3z0tjDQhyGjk2Y0suXSA3ktRHgTMQpitaDjA6OGuZw',
            name: 'timestamp',
            longName: 'Clock.timestamp',
            type: 'Double',
            connected: true,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    id: 81,
    jsModule: 'CanvasModule',
    type: 'module',
    name: 'clock with export',
    canClearState: true,
    canRefresh: true,
    hash: -1857250076,
    layout: {
        width: '250px',
        position: {
            top: '0px',
            left: '0px',
        },
        height: '150px',
    },
    uiChannel: {
        webcomponent: null,
        name: 'Notifications',
        id: 'FfZOECs6REuJtsvNgWp4uw',
    },
    options: {
        uiResendAll: {
            value: false,
            type: 'boolean',
        },
        uiResendLast: {
            value: 0,
            type: 'int',
        },
    },
    modules: [
        {
            params: [
                {
                    id: 'ep_SPoRlvchT7e1Z7Nm7PGsGg',
                    name: 'timezone',
                    longName: 'Clock.timezone',
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
                {
                    id: 'ep_YvOONmHlRS6tvFfqWn-oqg',
                    name: 'format',
                    longName: 'Clock.format',
                    type: 'String',
                    connected: false,
                    canConnect: true,
                    export: false,
                    value: 'yyyy-MM-dd HH:mm:ss z',
                    drivingInput: false,
                    canToggleDrivingInput: false,
                    acceptedTypes: [
                        'String',
                    ],
                    requiresConnection: false,
                    defaultValue: 'yyyy-MM-dd HH:mm:ss z',
                    isTextArea: false,
                },
                {
                    id: 'ep_EZWe5hLBRiGTxOAX9X2P7A',
                    name: 'rate',
                    longName: 'Clock.rate',
                    type: 'Double',
                    connected: false,
                    canConnect: true,
                    export: false,
                    value: 5,
                    drivingInput: false,
                    canToggleDrivingInput: false,
                    acceptedTypes: [
                        'Double',
                    ],
                    requiresConnection: false,
                    defaultValue: 1,
                },
                {
                    id: 'ep_Q6O5iSctTVuMTXP10TCVMg',
                    name: 'unit',
                    longName: 'Clock.unit',
                    type: 'String',
                    connected: false,
                    canConnect: true,
                    export: false,
                    value: 'SECOND',
                    drivingInput: false,
                    canToggleDrivingInput: false,
                    acceptedTypes: [
                        'String',
                    ],
                    requiresConnection: false,
                    possibleValues: [
                        {
                            name: 'second',
                            value: 'SECOND',
                        },
                        {
                            name: 'minute',
                            value: 'MINUTE',
                        },
                        {
                            name: 'hour',
                            value: 'HOUR',
                        },
                        {
                            name: 'day',
                            value: 'DAY',
                        },
                    ],
                    defaultValue: 'SECOND',
                },
            ],
            inputs: [],
            outputs: [
                {
                    id: 'ep_HOUkv4p4RXalZzWzQD8Syw',
                    name: 'date',
                    longName: 'Clock.date',
                    type: 'String',
                    connected: false,
                    canConnect: true,
                    export: false,
                    noRepeat: false,
                    canBeNoRepeat: true,
                },
                {
                    id: 'xJ3z0tjDQhyGjk2Y0suXSA3ktRHgTMQpitaDjA6OGuZw',
                    name: 'timestamp',
                    longName: 'Clock.timestamp',
                    type: 'Double',
                    connected: true,
                    canConnect: true,
                    export: false,
                    noRepeat: false,
                    canBeNoRepeat: true,
                },
            ],
            id: 209,
            jsModule: 'GenericModule',
            type: 'module',
            name: 'Clock',
            canClearState: true,
            canRefresh: false,
            hash: -261017640,
            layout: {
                width: '250px',
                position: {
                    top: '35px',
                    left: '14px',
                },
                height: '150px',
            },
        },
        {
            params: [],
            inputs: [
                {
                    id: 'ep_gqv8xvrlTQST5IU_0Vy3KQ',
                    name: 'endpoint-1550222185495',
                    longName: 'Table.in1',
                    type: 'Object',
                    connected: true,
                    canConnect: true,
                    export: false,
                    displayName: 'in1',
                    jsClass: 'VariadicInput',
                    variadic: {
                        requiresConnection: true,
                        isLast: false,
                        index: 1,
                    },
                    drivingInput: true,
                    canToggleDrivingInput: false,
                    acceptedTypes: [
                        'Object',
                    ],
                    requiresConnection: false,
                    sourceId: 'xJ3z0tjDQhyGjk2Y0suXSA3ktRHgTMQpitaDjA6OGuZw',
                },
                {
                    id: 'd48b6616-5e91-45ab-b0d0-f3cc09377419',
                    name: 'endpoint-d48b6616-5e91-45ab-b0d0-f3cc09377419',
                    longName: 'Table.in2',
                    type: 'Object',
                    connected: false,
                    canConnect: true,
                    export: false,
                    displayName: 'in2',
                    jsClass: 'VariadicInput',
                    variadic: {
                        isLast: true,
                        index: 2,
                    },
                    drivingInput: true,
                    canToggleDrivingInput: false,
                    acceptedTypes: [
                        'Object',
                    ],
                    requiresConnection: false,
                },
            ],
            outputs: [],
            id: 527,
            jsModule: 'TableModule',
            type: 'module event-table-module',
            name: 'Table',
            canClearState: true,
            canRefresh: false,
            hash: -261008375,
            layout: {
                width: '250px',
                position: {
                    top: '45px',
                    left: '701px',
                },
                height: '150px',
            },
            uiChannel: {
                webcomponent: 'streamr-table',
                name: 'Table',
                id: 'oj1NZ9bMRiqE6JeE8F1hMw',
            },
            options: {
                uiResendAll: {
                    value: false,
                    type: 'boolean',
                },
                uiResendLast: {
                    value: 20,
                    type: 'int',
                },
                maxRows: {
                    value: 20,
                    type: 'int',
                },
                showOnlyNewValues: {
                    value: true,
                    type: 'boolean',
                },
            },
            tableConfig: {
                headers: [
                    'timestamp',
                    'timestamp',
                ],
                title: 'Table',
            },
        },
    ],
})
