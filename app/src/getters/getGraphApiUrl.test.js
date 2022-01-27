/* eslint-disable global-require */
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('getGraphApiUrl with GRAPH_API_URL defined', () => {
    setTempEnv({
        GRAPH_API_URL: 'graph url',
        STREAMR_DOCKER_DEV_HOST: 'host',
    })

    it('uses the environment', () => {
        const { default: getter } = require('$app/src/getters/getGraphApiUrl')
        expect(getter()).toEqual('graph url')
    })
})

describe('getGraphApiUrl with blank GRAPH_API_URL', () => {
    setTempEnv({
        GRAPH_API_URL: '',
        STREAMR_DOCKER_DEV_HOST: 'host',
    })

    it('gets the address from the environment2', () => {
        const { default: getter } = require('$app/src/getters/getGraphApiUrl')
        expect(getter()).toEqual('http://host:8000/subgraphs/name/streamr-dev/network-contracts')
    })
})
