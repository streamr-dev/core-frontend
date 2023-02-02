import { Project, TermsOfUse } from '$mp/types/project-types'
import { ProjectTypeEnum } from '$mp/utils/constants'

export class EmptyProject implements Project {
    id: undefined
    name: undefined
    adminFee = undefined
    chain = undefined
    type = ProjectTypeEnum.OPEN_DATA
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
    termsOfUse = {} as TermsOfUse
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
    owner = undefined
    priceCurrency = undefined
    price = '1'
    pricingTokenDecimals = 10
    isFree = false
}
