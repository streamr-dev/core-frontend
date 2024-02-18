import getConfig from '~/getters/getConfig'
import setTempEnv from '../../test/test-utils/setTempEnv'
import g from './getCoreConfig'
jest.mock('~//getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))
describe('getCoreConfig', () => {
    it('when empty, returns defaults', () => {
        ;(getConfig as any).mockImplementation(() => ({}))
        expect(g()).toMatchObject({
            platformOriginUrl: undefined,
            streamrUrl: undefined,
        })
    })
    it('forwards custom core config fields', () => {
        ;(getConfig as any).mockImplementation(() => ({
            core: {
                custom: 'value',
            },
        }))
        expect(g().custom).toEqual('value')
    })
    describe('URL formatting', () => {
        setTempEnv({
            STREAMR_DOCKER_DEV_HOST: 'host',
        })
        it('formats selected URLs', () => {
            ;(getConfig as any).mockImplementation(() => ({
                core: {
                    platformOriginUrl: '/pf',
                    streamrUrl: '/sr',
                },
            }))
            expect(g()).toMatchObject({
                platformOriginUrl: 'http://host/pf',
                streamrUrl: 'http://host/sr',
            })
        })
    })
})
