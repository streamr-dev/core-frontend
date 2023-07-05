import { Project } from '~/marketplace/types/project-types'
import { ProjectType } from '~/shared/types'

export class EmptyProject implements Project {
    id = undefined
    name = ''
    creator = ''
    adminFee = undefined
    type = ProjectType.OpenData
    contact = {}
    imageUrl = undefined
    streams = []
    description = ''
    newImageToUpload = undefined
    termsOfUse = {
        commercialUse: false,
        redistribution: false,
        reselling: false,
        storage: false,
        termsName: undefined,
        termsUrl: undefined,
    }
    existingDUAddress = undefined
    salePoints = {}
}
