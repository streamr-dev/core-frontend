import { getToken } from '$shared/utils/sessionToken'
export default () => {
    const token: string | null | undefined = getToken()
    return token
        ? {
              Authorization: `Bearer ${token}`,
          }
        : {}
}
