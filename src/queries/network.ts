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
        creator
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
