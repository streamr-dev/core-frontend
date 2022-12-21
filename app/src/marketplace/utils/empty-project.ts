import { Project } from '$mp/types/project-types'

export class EmptyProject implements Project {
    id: undefined
    name: undefined
    adminFee = undefined
    category = undefined
    created = undefined
    contact = {}
    imageUrl = undefined
    streams = []
    description = undefined
    dataUnionDeployed = undefined
    newImageToUpload = undefined
    previewConfigJson = undefined
    thumbnailUrl = undefined
    ownerAddress = undefined
    termsOfUse = undefined
    updated = undefined
    minimumSubscriptionInSeconds = 1
    beneficiaryAddress = undefined
    pendingChanges = undefined
    timeUnit = undefined
    requiresWhitelist = false
    pricePerSecond = undefined
    previewStream = undefined
    existingDUAddress = undefined
    pricingTokenAddress = undefined

    priceCurrency = undefined // MATIC?
    price = '1'
    pricingTokenDecimals = 10
    isFree = false

    constructor(
        public type: Project['type'] = 'NORMAL',
        public owner: Project['owner'] = undefined,
        public chain: Project['chain'] = undefined
    ) {
    }
}
