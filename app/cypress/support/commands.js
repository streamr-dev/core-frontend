import StreamrClient from 'streamr-client'
import { mnemonicToSeedSync } from 'bip39'
import { hdkey } from 'ethereumjs-wallet'

import { setToken } from '$shared/utils/sessionToken'
import getAuthorizationHeader from '$shared/utils/getAuthorizationHeader'
import getClientConfig from '$shared/utils/getClientConfig'

const cache = {}

const getWallet = (mnemonic) => {
    const hdwallet = hdkey.fromMasterSeed(mnemonicToSeedSync(mnemonic))
    return hdwallet.derivePath("m/44'/60'/0'/0").getWallet()
}

const generatePrivateKey = (mnemonic) => {
    if (!cache[mnemonic]) {
        const wallet = getWallet(mnemonic)
        cache[mnemonic] = wallet.getPrivateKey().toString('hex')
    }
    return cache[mnemonic]
}

Cypress.Commands.add('login', (mnemonic = 'tester one') => (
    new StreamrClient({
        auth: {
            privateKey: generatePrivateKey(mnemonic),
        },
    }).session.getSessionToken().then(setToken)
))

Cypress.Commands.add('tokenLogin', (sessionToken) => (
    new StreamrClient({
        auth: {
            sessionToken,
        },
    }).session.getSessionToken().then(setToken)
))

Cypress.Commands.add('logout', () => {
    setToken(null)
})

Cypress.Commands.add('authenticatedRequest', (options = {}) => (
    cy.request({
        ...options,
        headers: {
            ...options.headers,
            ...getAuthorizationHeader(),
        },
    })
))

Cypress.Commands.add('getDefaultEthAccount', () => (
    cy
        .authenticatedRequest({
            url: 'http://localhost/api/v1/integration_keys',
            method: 'GET',
        })
        .then(({ body }) => {
            const { json } = (body || []).find(({ service }) => service === 'ETHEREUM_ID')

            return json && json.address
        })
))

Cypress.Commands.add('createStream', ({ domain: customDomain, stream } = {
    domain: undefined,
}) => (
    (!customDomain ? cy.getDefaultEthAccount() : Promise.resolve(customDomain))
        .then((domain) => (
            cy
                .authenticatedRequest({
                    url: 'http://localhost/api/v1/streams',
                    method: 'POST',
                    body: {
                        id: `${domain}/test-${(
                            new Date()
                                .toISOString()
                                .replace(/\W/g, '')
                                .substr(4, 11)
                                .replace(/T/, '-')
                        )}`,
                        ...stream,
                    },
                })
                .then(({ body: { id } }) => id)
        ))
))

Cypress.Commands.add('addToStorageNode', (streamId) => {
    // add the stream to DEV storage node ("broker-node-storage-1" on streamr-docker-dev environment)
    const DEV_STORAGE_NODE_ADDRESS = '0xde1112f631486CfC759A50196853011528bC5FA0'
    const DEV_STORAGE_NODE_URL = 'http://10.200.10.1:8891'
    const config = getClientConfig({
        url: 'ws://localhost/api/v1/ws',
        storageNode: {
            address: DEV_STORAGE_NODE_ADDRESS,
            url: DEV_STORAGE_NODE_URL,
        },
        autoConnect: false,
    })
    const client = new StreamrClient(config)
    return client
        .getStream(streamId)
        .then((stream) => stream.addToStorageNode(DEV_STORAGE_NODE_ADDRESS))
})

Cypress.Commands.add('getStream', (id) => {
    cy
        .authenticatedRequest({
            url: `http://localhost/api/v1/streams/${encodeURIComponent(id)}`,
        })
        .then(({ body }) => body)
})

Cypress.Commands.add('ignoreUncaughtError', (messageRegex) => {
    cy.on('uncaught:exception', (err) => {
        expect(err.message).to.match(messageRegex)
        return false
    })
})

Cypress.Commands.add('createStreamPermission', (streamId, user = null, operation = 'stream_get') => (
    cy
        .authenticatedRequest({
            url: `http://localhost/api/v1/streams/${encodeURIComponent(streamId)}/permissions`,
            method: 'POST',
            body: {
                anonymous: !user,
                new: true,
                operation,
                user: user != null ? getWallet(user).getAddressString() : null,
            },
        })
))

Cypress.Commands.add('createProduct', (body) => (
    cy
        .authenticatedRequest({
            url: 'http://localhost/api/v1/products',
            method: 'POST',
            body: {
                name: `Test Product #${(
                    new Date()
                        .toISOString()
                        .replace(/\W/g, '')
                        .substr(4, 11)
                        .replace(/T/, '/')
                )}`,
                ...body,
            },
        })
        .then(({ body: { id } }) => id)
))

Cypress.Commands.add('connectToClient', (options = {}) => {
    const client = new StreamrClient(getClientConfig(Object.assign({
        url: 'ws://localhost/api/v1/ws',
    }, options)))

    return client.ensureConnected().then(() => client)
})

Cypress.Commands.add('sendToStream', (streamId, payload) => (
    cy.connectToClient().then(async (client) => {
        const promise = new Promise((resolve) => {
            client.subscribe(streamId, () => {
                resolve()
            })
        })

        client.publish(streamId, payload)

        await promise

        return client.ensureConnected()
    })
))
