import { gql } from '@apollo/client'

gql`
    query getStreams(
        $streamIds: [String!]
        $first: Int
        $orderBy: StreamOrderBy
        $orderDirection: OrderDirection
        $search: String
        $owner: String
        $cursor: String
    ) {
        streams(
            pageSize: $first
            ids: $streamIds
            orderBy: $orderBy
            orderDirection: $orderDirection
            owner: $owner
            searchTerm: $search
            cursor: $cursor
        ) {
            items {
                bytesPerSecond
                description
                id
                messagesPerSecond
                peerCount
                publisherCount
                subscriberCount
            }
            cursor
        }
    }

    query getGlobalStreamsStats {
        summary {
            bytesPerSecond
            messagesPerSecond
            streamCount
        }
    }
`
