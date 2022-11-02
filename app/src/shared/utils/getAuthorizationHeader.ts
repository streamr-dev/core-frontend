import { getToken } from '$shared/utils/sessionToken'
export default (): {Authorization?: string} => {
    const token: string | null | undefined = getToken()
    return token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {}
}
