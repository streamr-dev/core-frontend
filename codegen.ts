import type { CodegenConfig } from '@graphql-codegen/cli'

const {
    GQL_SCHEMA_PATH:
        schema = 'http://localhost:8000/subgraphs/name/streamr-dev/network-subgraphs',
} = process.env

const config: CodegenConfig = {
    overwrite: true,
    schema,
    documents: './src/**/*.{ts,tsx,js,jsx}',
    generates: {
        'src/gql.ts': {
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                withHooks: true,
            },
        },
    },
}

export default config
