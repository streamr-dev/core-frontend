import { gql } from '@apollo/client'

gql`
    fragment DataUnionFields on DataUnion {
        id
        owner
        memberCount
        revenueWei
        creationDate
    }

    query getDataUnionsById($id: ID!) {
        dataUnions(where: { id: $id }) {
            ...DataUnionFields
        }
    }

    query getDataUnionsOwnedBy($owner: String!) {
        dataUnions(where: { owner: $owner }) {
            ...DataUnionFields
        }
    }
`
