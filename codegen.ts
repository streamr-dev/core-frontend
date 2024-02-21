import type { CodegenConfig } from '@graphql-codegen/cli'

// Load dotenv to support providing schema paths from .env file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('./scripts/dotenv')
dotenv()

const {
    NETWORK_GRAPH_SCHEMA_PATH = 'http://localhost:8800/subgraphs/name/streamr-dev/network-subgraphs',
    DU_GRAPH_SCHEMA_PATH = 'http://localhost:8800/subgraphs/name/streamr-dev/dataunion',
    ENS_GRAPH_SCHEMA_PATH = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    INDEXER_GRAPH_SCHEMA_PATH = 'https://stream-metrics.streamr.network/api',
} = process.env

const config: CodegenConfig = {
    overwrite: true,
    schema: [],
    documents: [],
    generates: {
        'src/generated/gql/network.ts': {
            documents: ['src/queries/network.ts'],
            schema: NETWORK_GRAPH_SCHEMA_PATH,
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                withHooks: false,
            },
        },
        'src/generated/gql/du.ts': {
            documents: ['src/queries/du.ts'],
            schema: DU_GRAPH_SCHEMA_PATH,
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                withHooks: false,
            },
        },
        'src/generated/gql/ens.ts': {
            documents: ['src/queries/ens.ts'],
            schema: ENS_GRAPH_SCHEMA_PATH,
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                withHooks: false,
            },
        },
        'src/generated/gql/indexer.ts': {
            documents: ['src/queries/indexer.ts'],
            schema: INDEXER_GRAPH_SCHEMA_PATH,
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                withHooks: false,
            },
        },
    },
}

export default config
