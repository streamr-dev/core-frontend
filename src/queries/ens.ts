import { gql } from '@apollo/client'

gql`
    query getEnsDomainsForAccount($account: String!) {
        domains(where: { owner_in: [$account] }, orderBy: name) {
            name
        }
    }
`
