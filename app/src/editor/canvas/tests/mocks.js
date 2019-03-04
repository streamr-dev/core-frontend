import uuid from 'uuid'

function remapIds(items) {
    return items.map((item) => ({
        ...item,
        id: uuid(),
    }))
}

function createMockModuleFactory(data) {
    return () => {
        const newData = { ...data }
        if (newData.inputs) { newData.inputs = remapIds(newData.inputs) }
        if (newData.outputs) { newData.outputs = remapIds(newData.outputs) }
        if (newData.params) { newData.params = remapIds(newData.params) }
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
