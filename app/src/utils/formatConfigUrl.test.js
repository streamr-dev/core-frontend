import setTempEnv from '$testUtils/setTempEnv'
import getConfig from '$app/src/getters/getConfig'
import f from './formatConfigUrl'

jest.mock('$app/src/getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))

const WS = {
    protocol: 'ws',
}

function testDockerHost({ envHost, expectedHost }) {
    return () => {
        beforeEach(() => {
            getConfig.mockImplementation(() => ({
                docker: {
                    host: 'testhost',
                },
            }))
        })

        setTempEnv({
            STREAMR_DOCKER_DEV_HOST: envHost,
        })

        it('applies proper hostname to strings starting with "/"', () => {
            expect(f('/path')).toEqual(`http://${expectedHost}/path`)
            expect(f('/path', WS)).toEqual(`ws://${expectedHost}/path`)
        })

        it('applies proper hostname to strings starting with ":"', () => {
            expect(f(':1234/path')).toEqual(`http://${expectedHost}:1234/path`)
            expect(f(':1234/path', WS)).toEqual(`ws://${expectedHost}:1234/path`)
        })

        it('applies proper hostname to empty strings', () => {
            expect(f('')).toEqual(`http://${expectedHost}`)
            expect(f('', WS)).toEqual(`ws://${expectedHost}`)
        })

        it('passes non-strings along, unchanged', () => {
            expect(f()).toBe(undefined)
            expect(f(null)).toBe(null)
            expect(f(false)).toBe(false) // and so on.
        })

        it('passes non-empty strings that start with charaters other than ":" and "/" along', () => {
            expect(f('http://url')).toEqual('http://url')
            expect(f('anything')).toEqual('anything')
            expect(f(' ')).toEqual(' ')
        })
    }
}

describe('formatConfigUrl without STREAMR_DOCKER_DEV_HOST', testDockerHost({
    envHost: '',
    expectedHost: 'testhost',
}))

describe('formatConfigUrl with STREAMR_DOCKER_DEV_HOST', testDockerHost({
    envHost: 'dockerhost',
    expectedHost: 'dockerhost',
}))
