import formatConfigUrl from '$utils/formatConfigUrl'
import config from '$config'

export default function formatRpc(rpc) {
    if (!rpc) {
        return rpc
    }

    const { client } = config

    return {
        ...rpc,
        timeout: rpc.timeout != null ? rpc.timeout : client?.chainTimeout,
        url: formatConfigUrl(rpc.url),
    }
}
