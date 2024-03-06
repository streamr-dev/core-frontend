import { gql } from '@apollo/client'

gql`
    fragment StakeFields on Stake {
        operator {
            id
            metadataJsonString
        }
        amountWei
        earningsWei
        lockedWei
        joinTimestamp
    }

    fragment OperatorFields on Operator {
        id
        stakes(first: 1000) {
            ...StakeFields
            sponsorship {
                ...SponsorshipFields
            }
        }
        delegations(first: 1000) {
            delegator {
                id
            }
            valueDataWei
            operatorTokenBalanceWei
            latestDelegationTimestamp
            earliestUndelegationTimestamp
            id
        }
        slashingEvents(first: 1000) {
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
            delegator {
                id
            }
            id
        }
        delegatorCount
        valueWithoutEarnings
        totalStakeInSponsorshipsWei
        dataTokenBalanceWei
        operatorTokenTotalSupplyWei
        metadataJsonString
        owner
        nodes
        cumulativeProfitsWei
        cumulativeOperatorsCutWei
        operatorsCutFraction
        contractVersion
    }

    query getAllOperators(
        $first: Int
        $skip: Int
        $searchQuery: ID
        $orderBy: Operator_orderBy
        $orderDirection: OrderDirection
    ) {
        operators(
            first: $first
            skip: $skip
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            ...OperatorFields
        }
    }

    query searchOperatorsByMetadata(
        $first: Int
        $skip: Int
        $searchQuery: String
        $id: ID!
        $orderBy: Operator_orderBy
        $orderDirection: OrderDirection
    ) {
        operators(
            first: $first
            skip: $skip
            where: {
                or: [
                    { id: $id }
                    { metadataJsonString_contains_nocase: $searchQuery }
                    { stakes_: { sponsorship_contains_nocase: $searchQuery } }
                ]
            }
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            ...OperatorFields
        }
    }

    query getOperatorById($operatorId: ID!, $minBlockNumber: Int = 0) {
        operator(id: $operatorId, block: { number_gte: $minBlockNumber }) {
            ...OperatorFields
        }
    }

    query getOperatorsByDelegation(
        $first: Int
        $skip: Int
        $delegator: String!
        $orderBy: Operator_orderBy
        $orderDirection: OrderDirection
    ) {
        operators(
            first: $first
            skip: $skip
            where: { delegations_: { delegator: $delegator } }
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            ...OperatorFields
        }
    }

    query getOperatorsByDelegationAndId(
        $first: Int
        $skip: Int
        $delegator: String!
        $operatorId: ID!
        $orderBy: Operator_orderBy
        $orderDirection: OrderDirection
    ) {
        operators(
            first: $first
            skip: $skip
            where: { delegations_: { delegator: $delegator }, id: $operatorId }
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            ...OperatorFields
        }
    }

    query getOperatorsByDelegationAndMetadata(
        $first: Int
        $skip: Int
        $delegator: String!
        $searchQuery: String!
        $orderBy: Operator_orderBy
        $orderDirection: OrderDirection
    ) {
        operators(
            first: $first
            skip: $skip
            where: {
                delegations_: { delegator: $delegator }
                metadataJsonString_contains_nocase: $searchQuery
            }
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            ...OperatorFields
        }
    }

    query getOperatorByOwnerAddress($owner: String!, $minBlockNumber: Int = 0) {
        operators(
            first: 1
            block: { number_gte: $minBlockNumber }
            where: { owner: $owner }
        ) {
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
        stakes(first: 1000, orderBy: amountWei, orderDirection: desc) {
            ...StakeFields
        }
        operatorCount
        minOperators
        maxOperators
        totalStakedWei
        remainingWei
        remainingWeiUpdateTimestamp
        projectedInsolvency
        cumulativeSponsoring
        minimumStakingPeriodSeconds
        creator
        spotAPY
    }

    query getAllSponsorships(
        $first: Int
        $skip: Int
        $searchQuery: String!
        $id: ID!
        $orderBy: Sponsorship_orderBy
        $orderDirection: OrderDirection
    ) {
        sponsorships(
            first: $first
            skip: $skip
            where: {
                or: [
                    { stream_contains_nocase: $searchQuery }
                    { id: $id }
                    { stakes_: { operator_contains_nocase: $searchQuery } }
                ]
            }
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            ...SponsorshipFields
        }
    }

    query getSponsorshipsByCreator(
        $first: Int
        $skip: Int
        $searchQuery: String!
        $id: ID!
        $creator: String!
        $orderBy: Sponsorship_orderBy
        $orderDirection: OrderDirection
    ) {
        sponsorships(
            first: $first
            skip: $skip
            where: {
                and: [
                    { creator: $creator }
                    {
                        or: [
                            { stream_contains_nocase: $searchQuery }
                            { id: $id }
                            { stakes_: { operator_contains_nocase: $searchQuery } }
                        ]
                    }
                ]
            }
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            ...SponsorshipFields
        }
    }

    query getSponsorshipById($sponsorshipId: ID!, $minBlockNumber: Int = 0) {
        sponsorship(id: $sponsorshipId, block: { number_gte: $minBlockNumber }) {
            ...SponsorshipFields
        }
    }

    query getSponsorshipByStreamId(
        $first: Int
        $skip: Int
        $orderBy: Sponsorship_orderBy
        $orderDirection: OrderDirection
        $streamId: String!
    ) {
        sponsorships(
            first: $first
            skip: $skip
            where: { stream_contains_nocase: $streamId }
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
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

    query getProject($id: ID!, $minBlockNumber: Int = 0) {
        project(id: $id, block: { number_gte: $minBlockNumber }) {
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

    query getProjectsByText(
        $first: Int
        $skip: Int
        $text: String!
        $where: Project_filter
    ) {
        projectSearch(first: $first, skip: $skip, text: $text, where: $where) {
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
        cumulativeEarningsWei
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
    fragment DelegatorDailyBucketFields on DelegatorDailyBucket {
        id
        totalValueDataWei
        date
        cumulativeEarningsWei
        operatorCount
    }

    query getDelegatorDailyBuckets(
        $where: DelegatorDailyBucket_filter!
        $first: Int
        $skip: Int
    ) {
        delegatorDailyBuckets(first: $first, skip: $skip, where: $where) {
            ...DelegatorDailyBucketFields
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
