import { gql } from '@apollo/client'

gql`
    query getEnsDomainsForAccount($account: String!) {
        domains(where: { resolvedAddress: $account }, orderBy: name) {
            name
        }
    }
`
