/* eslint-disable object-curly-newline */
import { ValidationError } from 'yup'
import validate from './validateEnv'

const VALID_ENV = {
    DAI_TOKEN_CONTRACT_ADDRESS: '0x642d2b84a32a9a92fec78ceaa9488388b3704898',
    DATA_UNION_FACTORY_SIDECHAIN_CREATION_BLOCK: '0',
    DATA_UNION_PUBLISH_MEMBER_LIMIT: '1',
    DU_FACTORY_MAINNET: '0x4bbcBeFBEC587f6C4AF9AF9B48847caEa1Fe81dA',
    DU_FACTORY_SIDECHAIN: '0x4A4c4759eb3b7ABee079f832850cD3D0dC48D927',
    DU_TEMPLATE_MAINNET: '0x7bFBAe10AE5b5eF45e2aC396E0E605F6658eF3Bc',
    DU_TEMPLATE_SIDECHAIN: '0x36afc8c9283CC866b8EB6a61C6e6862a83cd6ee8',
    ETHEREUM_SERVER_URL: 'http://127.0.0.1:8545',
    GRAPH_API_URL: 'http://127.0.0.1:8000/subgraphs/name/streamr-dev/network-contracts',
    MAIN_CHAIN_ID: '1',
    MARKETPLACE_CONTRACT_ADDRESS: '0xF1371c0f40528406dc4f4cAf89924eA9Da49E866',
    PLATFORM_ORIGIN_URL: 'http://127.0.0.1',
    PLATFORM_PUBLIC_PATH: 'https://cdn.streamr.com',
    PORT: '3333',
    REST_URL: 'http://127.0.0.1/api/v1',
    SENTRY_ORG: 'streamr',
    SENTRY_PROJECT: 'marketplace',
    SIDE_CHAIN_ID: '8997',
    SIDECHAIN_URL: 'http://127.0.0.1:8546',
    STORAGE_NODES: 'Local node:0xde1112f631486CfC759A50196853011528bC5FA0',
    STREAMR_ENGINE_NODE_ADDRESSES: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    TOKEN_ADDRESS_SIDECHAIN: '0xbAA81A0179015bE47Ad439566374F2Bae098686F',
    TOKEN_ADDRESS: '0x73Be21733CC5D08e1a14Ea9a399fb27DB3BEf8fF',
    UNISWAP_ADAPTOR_CONTRACT_ADDRESS: '0xE4eA76e830a659282368cA2e7E4d18C4AE52D8B3',
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

it('ensures valid DAI_TOKEN_CONTRACT_ADDRESS', ethereumAddressTest('DAI_TOKEN_CONTRACT_ADDRESS'))

it('ensures valid DATA_UNION_FACTORY_SIDECHAIN_CREATION_BLOCK', nonNegativeNumericTest('DATA_UNION_FACTORY_SIDECHAIN_CREATION_BLOCK'))

it('ensures valid DATA_UNION_PUBLISH_MEMBER_LIMIT', nonNegativeNumericTest('DATA_UNION_PUBLISH_MEMBER_LIMIT'))

it('ensures valid DU_FACTORY_MAINNET', ethereumAddressTest('DU_FACTORY_MAINNET'))

it('ensures valid DU_FACTORY_SIDECHAIN', ethereumAddressTest('DU_FACTORY_SIDECHAIN'))

it('ensures valid DU_TEMPLATE_MAINNET', ethereumAddressTest('DU_TEMPLATE_MAINNET'))

it('ensures valid DU_TEMPLATE_SIDECHAIN', ethereumAddressTest('DU_TEMPLATE_SIDECHAIN'))

it('ensures valid ETHEREUM_SERVER_URL', urlTest('ETHEREUM_SERVER_URL'))

it('ensures valid GRAPH_API_URL', urlTest('GRAPH_API_URL'))

it('ensures valid MAIN_CHAIN_ID', nonNegativeNumericTest('MAIN_CHAIN_ID', { allowZero: false }))

it('ensures valid MARKETPLACE_CONTRACT_ADDRESS', ethereumAddressTest('MARKETPLACE_CONTRACT_ADDRESS'))

it('ensures valid PLATFORM_ORIGIN_URL', urlTest('PLATFORM_ORIGIN_URL'))

it('ensures valid PLATFORM_PUBLIC_PATH', presenceTest('PLATFORM_PUBLIC_PATH'))

it('ensures valid PORT', nonNegativeNumericTest('PORT'))

it('ensures valid REST_URL', urlTest('REST_URL'))

it('ensures valid SENTRY_ORG', presenceTest('SENTRY_ORG'))

it('ensures valid SENTRY_PROJECT', presenceTest('SENTRY_PROJECT'))

it('ensures valid SIDE_CHAIN_ID', nonNegativeNumericTest('SIDE_CHAIN_ID', { allowZero: false }))

it('ensures valid SIDECHAIN_URL', urlTest('SIDECHAIN_URL'))

it('ensures valid STORAGE_NODES', async () => {
    await presenceTest('STORAGE_NODES')()

    await ex({
        STORAGE_NODES: 'A:B',
    }).rejects.toThrow(ValidationError)

    await ex({
        STORAGE_NODES: 'A:0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ',
    }).rejects.toThrow(ValidationError)

    await ex({
        STORAGE_NODES: 'A:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    }).rejects.toThrow(ValidationError)

    await ex({
        STORAGE_NODES: 'A:0x0',
    }).rejects.toThrow(ValidationError)

    await ex({
        STORAGE_NODES: 'anything',
    }).rejects.toThrow(ValidationError)

    await ex({
        STORAGE_NODES: ':0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    }).rejects.toThrow(ValidationError)

    await ex({
        STORAGE_NODES: ' :0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    }).rejects.toThrow(ValidationError)

    await ex({
        STORAGE_NODES: ' Name::0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    }).rejects.toThrow(ValidationError)

    await ex({
        STORAGE_NODES: ' Name:0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    }).resolves
})

it('ensures valid STREAMR_ENGINE_NODE_ADDRESSES', ethereumAddressTest('STREAMR_ENGINE_NODE_ADDRESSES'))

it('ensures valid TOKEN_ADDRESS_SIDECHAIN', ethereumAddressTest('TOKEN_ADDRESS_SIDECHAIN'))

it('ensures valid TOKEN_ADDRESS', ethereumAddressTest('TOKEN_ADDRESS'))

it('ensures valid UNISWAP_ADAPTOR_CONTRACT_ADDRESS', ethereumAddressTest('UNISWAP_ADAPTOR_CONTRACT_ADDRESS'))

it('ensures valid WEB3_TRANSACTION_CONFIRMATION_BLOCKS', nonNegativeNumericTest('WEB3_TRANSACTION_CONFIRMATION_BLOCKS'))
