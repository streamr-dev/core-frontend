const { object, string, number, lazy } = require('yup')

const chainId = () => lazy((v) => (
    typeof v === 'string'
        ? string().required().matches(/^[1-9]\d*$/)
        : number().required().min(1)
))

const ethereumAddress = () => string()
    .required()
    .matches(/^0x[a-f\d]{40}$/i, 'is not a valid ethereum address')

const nonNegativeNumberic = () => lazy((v) => (
    typeof v === 'string'
        ? string().required().matches(/^\d+$/)
        : number().required().min(0)
))

const storageNodeCollection = () => string().matches(/^(\s*[^:\s][^:]*:0x[a-f\d]{40})(,\s*[^:\s][^:]*:0x[a-f\d]{40})*$/)

const envSchema = object({
    DAI_TOKEN_CONTRACT_ADDRESS: ethereumAddress(),
    DATA_UNION_FACTORY_SIDECHAIN_CREATION_BLOCK: nonNegativeNumberic(),
    DATA_UNION_PUBLISH_MEMBER_LIMIT: nonNegativeNumberic(),
    DU_FACTORY_MAINNET: ethereumAddress(),
    DU_FACTORY_SIDECHAIN: ethereumAddress(),
    DU_TEMPLATE_MAINNET: ethereumAddress(),
    DU_TEMPLATE_SIDECHAIN: ethereumAddress(),
    ETHEREUM_SERVER_URL: string().required().url(),
    GRAPH_API_URL: string().required().url(),
    MAIN_CHAIN_ID: chainId(),
    MARKETPLACE_CONTRACT_ADDRESS: ethereumAddress(),
    PLATFORM_ORIGIN_URL: string().required().url(),
    PLATFORM_PUBLIC_PATH: string().required().url(),
    PORT: nonNegativeNumberic(),
    REST_URL: string().required().url(),
    SENTRY_ORG: string().required(),
    SENTRY_PROJECT: string().required(),
    SIDE_CHAIN_ID: chainId(),
    SIDECHAIN_URL: string().required().url(),
    STORAGE_NODES: storageNodeCollection().required(),
    STREAMR_ENGINE_NODE_ADDRESSES: ethereumAddress(),
    TOKEN_ADDRESS_SIDECHAIN: ethereumAddress(),
    TOKEN_ADDRESS: ethereumAddress(),
    UNISWAP_ADAPTOR_CONTRACT_ADDRESS: ethereumAddress(),
    WEB3_TRANSACTION_CONFIRMATION_BLOCKS: nonNegativeNumberic(),
})

module.exports = (env) => (
    envSchema.validate(env)
)
