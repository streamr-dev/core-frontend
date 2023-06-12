import { ChainConnectionInfo } from 'streamr-client/types/src/Config'
import formatConfigUrl from '$utils/formatConfigUrl'
import getConfig from '$app/src/getters/getConfig'
// TODO add typing
export default function formatRpc(rpc: any): ChainConnectionInfo {
    if (!rpc || typeof rpc !== 'object' || !('rpcs' in rpc)) {
        return rpc
    }

    const { client } = getConfig()
    return {
        ...rpc,
        rpcs: rpc.rpcs.map((r: any) => ({
            timeout: r.timeout != null ? r.timeout : client?.chainTimeout,
            url: formatConfigUrl(r.url),
        })),
    }
}
