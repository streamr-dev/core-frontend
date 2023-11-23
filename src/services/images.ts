import getCoreConfig from '~/getters/getCoreConfig'
import { post } from '~/shared/utils/api'

export async function postImage(image: File): Promise<string> {
    const {
        projectId: username,
        apiSecretKey: password,
        ipfsUploadEndpoint: url,
    } = getCoreConfig().ipfs

    const data = new FormData()

    data.append('file', image, image.name)

    const uploadResult = await post({
        url,
        options: {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            auth: {
                username,
                password,
            },
        },
        data,
    })

    return uploadResult?.Hash || ''
}
