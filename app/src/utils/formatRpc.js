import formatConfigUrl from '$utils/formatConfigUrl'
import getConfig from '$app/src/getters/getConfig'

export default function formatRpc(rpc) {
    if (!rpc || typeof rpc !== 'object') {
        return rpc
    }

    const { client } = getConfig()

    return {
        ...rpc,
        timeout: rpc.timeout != null ? rpc.timeout : client?.chainTimeout,
        url: formatConfigUrl(rpc.url),
    }
}
