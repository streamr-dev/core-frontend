import { gql } from '@apollo/client'

gql`
    fragment OperatorFields on Operator {
        id
        stakes {
            operator {
                id
            }
            amount
            allocatedWei
            date
            sponsorship {
                id
            }
        }
        delegators {
            operator {
                id
            }
            poolTokenWei
        }
        delegatorCount
        poolValue
        totalValueInSponsorshipsWei
        freeFundsWei
        poolValueTimestamp
        poolValueBlockNumber
        poolTokenTotalSupplyWei
        exchangeRate
        metadataJsonString
        owner
    }

    query getAllOperators($first: Int, $skip: Int) {
        operators(first: $first, skip: $skip) {
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
            }
            amount
            allocatedWei
            date
        }
        operatorCount
        totalStakedWei
        unallocatedWei
        projectedInsolvency
        cumulativeSponsoring
        creator
        spotAPY
    }

    query getAllSponsorships($first: Int, $skip: Int, $streamContains: String) {
        sponsorships(
            first: $first
            skip: $skip
            where: { stream_contains: $streamContains }
        ) {
            ...SponsorshipFields
        }
    }

    query getSponsorshipsByCreator(
        $first: Int
        $skip: Int
        $streamContains: String
        $creator: String!
    ) {
        sponsorships(
            first: $first
            skip: $skip
            where: { creator: $creator, stream_contains: $streamContains }
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
        }
    }

    query getStreamById($streamId: ID!) {
        stream(id: $streamId) {
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
        totalPayoutsCumulative
        totalStakedWei
        unallocatedWei
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
