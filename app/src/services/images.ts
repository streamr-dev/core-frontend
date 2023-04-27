import getCoreConfig from '$app/src/getters/getCoreConfig'
import { post } from '$shared/utils/api'

export const postImage = async (image: File): Promise<string> => {
    const config = getCoreConfig()
    const { projectId, apiSecretKey, ipfsUploadEndpoint } = config.ipfs
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        auth: {
            username: projectId,
            password: apiSecretKey,
        },
    }
    const data = new FormData()
    data.append('file', image, image.name)
    const uploadResult = await post({ url: ipfsUploadEndpoint, options, data })
    return !!uploadResult && uploadResult.Hash ? uploadResult.Hash : null
}
