import path from 'path'

import { Polly } from '@pollyjs/core'
import XHRAdapter from '@pollyjs/adapter-xhr'
import FilesystemPersister from '@pollyjs/persister-fs'
import { setupPolly } from 'setup-polly-jest'

Polly.register(XHRAdapter)
Polly.register(FilesystemPersister)

export default function (opts = {}) {
    return setupPolly({
        adapters: ['xhr', 'node-http'],
        persister: 'fs',
        persisterOptions: {
            fs: {
                recordingsDir: path.resolve(__dirname, '__recordings__'),
            },
        },
        ...opts,
    })
}
