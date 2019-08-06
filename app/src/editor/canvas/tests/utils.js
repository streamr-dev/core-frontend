export const canvasMatcher = {
    id: expect.any(String),
    name: expect.any(String),
    created: expect.any(String),
    updated: expect.any(String),
    uiChannel: expect.objectContaining({
        id: expect.any(String),
    }),
}

function matchPorts(ports) {
    return expect.objectContaining(ports.map((port) => {
        const portMatcher = { ...port }
        if (port.sourceId == null) { delete portMatcher.sourceId }
        if (port.value == null) { delete portMatcher.value }

        return expect.objectContaining(portMatcher)
    }))
}

expect.extend({
    toMatchCanvas(targetCanvas, sourceCanvas, additional = {}) {
        expect(targetCanvas).toMatchObject({
            ...sourceCanvas,
            ...canvasMatcher,
            modules: expect.objectContaining(sourceCanvas.modules.map((m, i) => {
                const source = { ...sourceCanvas.modules[i] }
                let matcher = source
                if (source.uiChannel) {
                    matcher = {
                        ...matcher,
                        uiChannel: expect.objectContaining({
                            id: expect.any(String),
                        }),
                    }
                }

                if (source.inputs) {
                    matcher.inputs = matchPorts(source.inputs)
                }
                if (source.params) {
                    matcher.params = matchPorts(source.params)
                }
                if (source.outputs) {
                    matcher.outputs = matchPorts(source.outputs)
                }

                if (matcher.tableConfig) {
                    matcher.tableConfig = expect.anything()
                }

                return expect.objectContaining(matcher)
            })),
            ...additional,
        })

        return {
            pass: true,
            message: () => '',
        }
    },
})
