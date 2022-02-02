/* eslint-disable object-curly-newline */
import { ValidationError } from 'yup'
import validate from './validateEnv'

const VALID_ENV = {
    DATA_UNION_FACTORY_SIDECHAIN_CREATION_BLOCK: '0',
    DATA_UNION_PUBLISH_MEMBER_LIMIT: '1',
    DU_FACTORY_MAINNET: '0x4bbcBeFBEC587f6C4AF9AF9B48847caEa1Fe81dA',
    DU_FACTORY_SIDECHAIN: '0x4A4c4759eb3b7ABee079f832850cD3D0dC48D927',
    DU_TEMPLATE_MAINNET: '0x7bFBAe10AE5b5eF45e2aC396E0E605F6658eF3Bc',
    DU_TEMPLATE_SIDECHAIN: '0x36afc8c9283CC866b8EB6a61C6e6862a83cd6ee8',
    GRAPH_API_URL: 'http://127.0.0.1:8000/subgraphs/name/streamr-dev/network-contracts',
    PLATFORM_PUBLIC_PATH: 'https://cdn.streamr.com',
    PORT: '3333',
    SENTRY_ORG: 'streamr',
    SENTRY_PROJECT: 'marketplace',
    SIDE_CHAIN_ID: '8997',
    SIDECHAIN_URL: 'http://127.0.0.1:8546',
    WEB3_TRANSACTION_CONFIRMATION_BLOCKS: '1',
}

function ex(env = {}) {
    return expect(() => validate({ ...VALID_ENV, ...env }))
}

function presenceTest(key) {
    return async () => {
        await ex({
            [key]: null,
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: undefined,
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: '',
        }).rejects.toThrow(ValidationError)
    }
}

function ethereumAddressTest(key) {
    return async () => {
        await presenceTest(key)()

        await ex({
            [key]: '0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ',
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: '0x0',
        }).rejects.toThrow(ValidationError)
    }
}

function urlTest(key) {
    return async () => {
        await presenceTest(key)()

        await ex({
            [key]: 'http://',
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: 'anything',
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: 1,
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: {},
        }).rejects.toThrow(ValidationError)
    }
}

function nonNegativeNumericTest(key, { allowZero = true } = {}) {
    return async () => {
        await presenceTest(key)()

        if (allowZero) {
            await ex({
                [key]: 0,
            }).resolves

            await ex({
                [key]: '0',
            }).resolves
        } else {
            await ex({
                [key]: 0,
            }).rejects.toThrow(ValidationError)

            await ex({
                [key]: '0',
            }).rejects.toThrow(ValidationError)
        }

        await ex({
            [key]: '-1',
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: -1,
        }).rejects.toThrow(ValidationError)
    }
}

it('validates valid env successfully', async () => {
    await ex().resolves
})

it('ensures valid DATA_UNION_FACTORY_SIDECHAIN_CREATION_BLOCK', nonNegativeNumericTest('DATA_UNION_FACTORY_SIDECHAIN_CREATION_BLOCK'))

it('ensures valid DATA_UNION_PUBLISH_MEMBER_LIMIT', nonNegativeNumericTest('DATA_UNION_PUBLISH_MEMBER_LIMIT'))

it('ensures valid DU_FACTORY_MAINNET', ethereumAddressTest('DU_FACTORY_MAINNET'))

it('ensures valid DU_FACTORY_SIDECHAIN', ethereumAddressTest('DU_FACTORY_SIDECHAIN'))

it('ensures valid DU_TEMPLATE_MAINNET', ethereumAddressTest('DU_TEMPLATE_MAINNET'))

it('ensures valid DU_TEMPLATE_SIDECHAIN', ethereumAddressTest('DU_TEMPLATE_SIDECHAIN'))

it('ensures valid GRAPH_API_URL', urlTest('GRAPH_API_URL'))

it('ensures valid PLATFORM_PUBLIC_PATH', presenceTest('PLATFORM_PUBLIC_PATH'))

it('ensures valid PORT', nonNegativeNumericTest('PORT'))

it('ensures valid SENTRY_ORG', presenceTest('SENTRY_ORG'))

it('ensures valid SENTRY_PROJECT', presenceTest('SENTRY_PROJECT'))

it('ensures valid SIDE_CHAIN_ID', nonNegativeNumericTest('SIDE_CHAIN_ID', { allowZero: false }))

it('ensures valid SIDECHAIN_URL', urlTest('SIDECHAIN_URL'))

it('ensures valid WEB3_TRANSACTION_CONFIRMATION_BLOCKS', nonNegativeNumericTest('WEB3_TRANSACTION_CONFIRMATION_BLOCKS'))
