import { gql } from '@apollo/client'

gql`
    fragment OperatorFields on Operator {
        id
        stakes {
            operator {
                id
            }
            amount
            earningsWei
            joinDate
            sponsorship {
                ...SponsorshipFields
            }
        }
        delegators {
            delegatedDataWei
            delegator
        }
        slashingEvents {
            amount
            date
            sponsorship {
                id
                stream {
                    id
                }
            }
        }
        queueEntries(first: 1000) {
            amount
            date
            delegator
            id
        }
        delegatorCount
        valueWithoutEarnings
        totalStakeInSponsorshipsWei
        dataTokenBalanceWei
        operatorTokenTotalSupplyWei
        exchangeRate
        metadataJsonString
        owner
        nodes
        cumulativeProfitsWei
        cumulativeOperatorsCutWei
        operatorsCutFraction
    }

    query getAllOperators($first: Int, $skip: Int, $searchQuery: ID) {
        operators(first: $first, skip: $skip) {
            ...OperatorFields
        }
    }

    query searchOperatorsById($first: Int, $skip: Int, $operatorId: ID) {
        operators(first: $first, skip: $skip, where: { id: $operatorId }) {
            ...OperatorFields
        }
    }

    query searchOperatorsByMetadata($first: Int, $skip: Int, $searchQuery: String) {
        operators(
            first: $first
            skip: $skip
            where: { metadataJsonString_contains_nocase: $searchQuery }
        ) {
            ...OperatorFields
        }
    }

    query getOperatorById($operatorId: ID!) {
        operator(id: $operatorId) {
            ...OperatorFields
        }
    }

    query getOperatorsByDelegation($first: Int, $skip: Int, $delegator: String!) {
        operators(
            first: $first
            skip: $skip
            where: { delegators_: { delegator: $delegator } }
        ) {
            ...OperatorFields
        }
    }

    query getOperatorsByDelegationAndId(
        $first: Int
        $skip: Int
        $delegator: String!
        $operatorId: ID!
    ) {
        operators(
            first: $first
            skip: $skip
            where: { delegators_: { delegator: $delegator }, id: $operatorId }
        ) {
            ...OperatorFields
        }
    }

    query getOperatorsByDelegationAndMetadata(
        $first: Int
        $skip: Int
        $delegator: String!
        $searchQuery: String!
    ) {
        operators(
            first: $first
            skip: $skip
            where: {
                delegators_: { delegator: $delegator }
                metadataJsonString_contains_nocase: $searchQuery
            }
        ) {
            ...OperatorFields
        }
    }

    query getOperatorByOwnerAddress($owner: String!) {
        operators(where: { owner: $owner }) {
            ...OperatorFields
        }
    }
`

gql`
    fragment SponsorshipFields on Sponsorship {
        id
        stream {
            id
            metadata
        }
        metadata
        isRunning
        totalPayoutWeiPerSec
        stakes {
            operator {
                id
                metadataJsonString
            }
            amount
            earningsWei
            joinDate
        }
        operatorCount
        totalStakedWei
        remainingWei
        projectedInsolvency
        cumulativeSponsoring
        minimumStakingPeriodSeconds
        creator
        spotAPY
    }

    query getAllSponsorships($first: Int, $skip: Int, $streamContains: String!) {
        sponsorships(
            first: $first
            skip: $skip
            where: { stream_contains_nocase: $streamContains }
        ) {
            ...SponsorshipFields
        }
    }

    query getSponsorshipsByCreator(
        $first: Int
        $skip: Int
        $streamContains: String!
        $creator: String!
    ) {
        sponsorships(
            first: $first
            skip: $skip
            where: { creator: $creator, stream_contains_nocase: $streamContains }
        ) {
            ...SponsorshipFields
        }
    }

    query getSponsorshipById($sponsorshipId: ID!) {
        sponsorship(id: $sponsorshipId) {
            ...SponsorshipFields
        }
    }
`

gql`
    fragment ProjectFields on Project {
        id
        domainIds
        score
        metadata
        streams
        minimumSubscriptionSeconds
        createdAt
        updatedAt
        isDataUnion
        paymentDetails {
            domainId
            beneficiary
            pricingTokenAddress
            pricePerSecond
        }
        subscriptions {
            userAddress
            endTimestamp
        }
        permissions {
            userAddress
            canBuy
            canDelete
            canEdit
            canGrant
        }
        purchases {
            subscriber
            subscriptionSeconds
            price
            fee
            purchasedAt
        }
    }

    query getProject($id: ID!) {
        project(id: $id) {
            ...ProjectFields
        }
    }

    query getProjects($first: Int, $skip: Int, $where: Project_filter) {
        projects(
            first: $first
            skip: $skip
            orderBy: score
            orderDirection: desc
            where: $where
        ) {
            ...ProjectFields
        }
    }

    query getProjectsByText($first: Int, $skip: Int, $text: String!) {
        projectSearch(first: $first, skip: $skip, text: $text) {
            ...ProjectFields
        }
    }

    query getProjectSubscriptions($id: ID!) {
        project(id: $id) {
            subscriptions {
                userAddress
                endTimestamp
            }
        }
    }

    query getProjectForPurchase($id: ID!) {
        project(id: $id) {
            streams
            paymentDetails {
                domainId
                beneficiary
                pricingTokenAddress
                pricePerSecond
            }
        }
    }
`

gql`
    fragment StreamFields on Stream {
        id
        metadata
        permissions {
            id
            canGrant
            canEdit
            canDelete
            userAddress
            subscribeExpiration
            publishExpiration
        }
    }

    query getStreamById($streamId: ID!) {
        stream(id: $streamId) {
            ...StreamFields
        }
    }

    query getStreams($streamIds: [ID!]!) {
        streams(where: { id_in: $streamIds }) {
            ...StreamFields
        }
    }

    query getPagedStreams(
        $first: Int
        $orderBy: Stream_orderBy
        $orderDirection: OrderDirection
        $where: Stream_filter
    ) {
        streams(
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
        ) {
            ...StreamFields
        }
    }
`

gql`
    fragment SponsorshipDailyBucketFields on SponsorshipDailyBucket {
        id
        operatorCount
        projectedInsolvency
        spotAPY
        totalStakedWei
        remainingWei
        date
        sponsorship {
            id
        }
    }

    query getSponsorshipDailyBuckets(
        $where: SponsorshipDailyBucket_filter!
        $first: Int
        $skip: Int
    ) {
        sponsorshipDailyBuckets(first: $first, skip: $skip, where: $where) {
            ...SponsorshipDailyBucketFields
        }
    }
`

gql`
    fragment SponsoringEventFields on SponsoringEvent {
        id
        amount
        date
        sponsor
    }

    query getSponsoringEvents($sponsorshipId: ID!, $first: Int, $skip: Int) {
        sponsoringEvents(
            where: { sponsorship_: { id: $sponsorshipId } }
            first: $first
            skip: $skip
            orderBy: date
            orderDirection: desc
        ) {
            ...SponsoringEventFields
        }
    }
`

gql`
    fragment OperatorDailyBucketFields on OperatorDailyBucket {
        date
        id
        dataTokenBalanceWei
        delegatorCountChange
        delegatorCountAtStart
        lossesWei
        operatorsCutWei
        valueWithoutEarnings
        profitsWei
        spotAPY
        totalDelegatedWei
        totalUndelegatedWei
        totalStakeInSponsorshipsWei
    }

    query getOperatorDailyBuckets(
        $where: OperatorDailyBucket_filter!
        $first: Int
        $skip: Int
    ) {
        operatorDailyBuckets(first: $first, skip: $skip, where: $where) {
            ...OperatorDailyBucketFields
        }
    }
`

gql`
    query getMetadata {
        _meta {
            block {
                hash
                number
                timestamp
            }
        }
    }
`
