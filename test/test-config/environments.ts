import fs from 'fs'
import path from 'path'
import toml from 'toml'

const config = toml.parse(
    fs.readFileSync(path.resolve(__dirname, '../../src/config/environments.toml'), {
        encoding: 'utf-8',
    }),
)

export default config
