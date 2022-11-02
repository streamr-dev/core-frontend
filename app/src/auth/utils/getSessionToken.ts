import getCoreConfig from '$app/src/getters/getCoreConfig'
import getWeb3 from '$utils/web3/getWeb3'
import { post } from '$shared/utils/api'

// TODO add typing
const parseError = ({ body }: any) => {
    const message = ((defaultMessage) => {
        try {
            return JSON.parse(body).message || defaultMessage
        } catch (e) {
            return defaultMessage
        }
    })('Something went wrong.')

    return new Error(message)
}

export default async (address: string): Promise<string> => {
    try {
        const { streamrUrl } = getCoreConfig()
        const api = `${streamrUrl}/api/v2`

        // Get challenge
        const challenge = await post({
            url: `${api}/login/challenge/${address}`,
        })

        // Sign challenge
        const signature = await getWeb3().eth.personal.sign(challenge.challenge, address)

        // Send response
        const loginResponse = await post({
            url: `${api}/login/response`,
            data: {
                challenge,
                signature,
                address,
            },
        })

        return loginResponse.token
    } catch (e) {
        throw parseError(e)
    }
}
