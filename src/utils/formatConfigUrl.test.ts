import setTempEnv from '../../test/test-utils/setTempEnv'
import formatConfigUrl from './formatConfigUrl'

function testDockerHost({ envHost, expectedHost }) {
    const dockerHost = 'testhost'

    return () => {
        setTempEnv({
            STREAMR_DOCKER_DEV_HOST: envHost,
        })

        it('applies proper hostname to strings starting with "/"', () => {
            expect(formatConfigUrl('/path', { dockerHost })).toEqual(
                `http://${expectedHost}/path`,
            )
            expect(formatConfigUrl('/path', { protocol: 'ws', dockerHost })).toEqual(
                `ws://${expectedHost}/path`,
            )
        })

        it('applies proper hostname to strings starting with ":"', () => {
            expect(formatConfigUrl(':1234/path', { dockerHost })).toEqual(
                `http://${expectedHost}:1234/path`,
            )
            expect(formatConfigUrl(':1234/path', { protocol: 'ws', dockerHost })).toEqual(
                `ws://${expectedHost}:1234/path`,
            )
        })

        it('applies proper hostname to empty strings', () => {
            expect(formatConfigUrl('', { dockerHost })).toEqual(`http://${expectedHost}`)
            expect(formatConfigUrl('', { protocol: 'ws', dockerHost })).toEqual(
                `ws://${expectedHost}`,
            )
        })

        it('passes non-empty strings that start with charaters other than ":" and "/" along', () => {
            expect(formatConfigUrl('http://url', { dockerHost })).toEqual('http://url')
            expect(formatConfigUrl('anything', { dockerHost })).toEqual('anything')
            expect(formatConfigUrl(' ', { dockerHost })).toEqual(' ')
        })
    }
}

describe(
    'formatConfigUrl without STREAMR_DOCKER_DEV_HOST',
    testDockerHost({
        envHost: '',
        expectedHost: 'testhost',
    }),
)

describe(
    'formatConfigUrl with STREAMR_DOCKER_DEV_HOST',
    testDockerHost({
        envHost: 'dockerhost',
        expectedHost: 'dockerhost',
    }),
)
