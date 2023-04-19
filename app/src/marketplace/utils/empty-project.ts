import { Project } from '$mp/types/project-types'
import { ProjectType } from '$shared/types'

export class EmptyProject implements Project {
    id: undefined
    name: undefined
    adminFee = undefined
    type = ProjectType.OpenData
    contact = {}
    imageUrl = undefined
    streams = []
    description = undefined
    dataUnionDeployed = undefined
    newImageToUpload = undefined
    termsOfUse = {
        commercialUse: false,
        redistribution: false,
        reselling: false,
        storage: false,
        termsName: undefined,
        termsUrl: undefined
    }
    minimumSubscriptionInSeconds = 0
    existingDUAddress = undefined
    salePoints = {}
}
