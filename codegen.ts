import type { CodegenConfig } from '@graphql-codegen/cli'

const {
    NETWORK_GRAPH_SCHEMA_PATH = 'http://localhost:8000/subgraphs/name/streamr-dev/network-subgraphs',
    ENS_GRAPH_SCHEMA_PATH = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
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
                withHooks: true,
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
    },
}

export default config
