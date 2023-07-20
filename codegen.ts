import type { CodegenConfig } from '@graphql-codegen/cli'

const {
    NETWORK_GRAPH_SCHEMA_PATH = 'http://localhost:8000/subgraphs/name/streamr-dev/network-subgraphs',
    HUB_GRAPH_SCHEMA_PATH = 'http://localhost:8000/subgraphs/name/streamr-dev/hub-subgraph',
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
        'src/generated/gql/hub.ts': {
            schema: HUB_GRAPH_SCHEMA_PATH,
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                withHooks: true,
            },
        },
    },
}

export default config
