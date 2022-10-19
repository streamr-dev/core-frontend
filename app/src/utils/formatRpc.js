import formatConfigUrl from '$utils/formatConfigUrl'
import getConfig from '$app/src/getters/getConfig'

export default function formatRpc(rpc) {
    if (!rpc || typeof rpc !== 'object' || !('rpcs' in rpc)) {
        return rpc
    }

    const { client } = getConfig()

    return {
        ...rpc,
        rpcs: rpc.rpcs.map((r) => ({
            timeout: r.timeout != null ? r.timeout : client?.chainTimeout,
            url: formatConfigUrl(r.url),
        })),
    }
}
