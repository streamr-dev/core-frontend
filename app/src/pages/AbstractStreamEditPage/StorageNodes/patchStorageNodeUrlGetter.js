// `10.200.10.1` is the hardcoded storage node URL in our development (docker) environment. See
// https://github.com/streamr-dev/network-contracts/blob/4cf94ed9fb3eb045288c48f3e242430a4b65414a/packages/docker-dev-chain-init/index.js#L243
//
// In short, it means that devs that prefer a custom process.env.STREAMR_DOCKER_DEV_HOST (docker on
// a different machine) will not be able to get an accessible dev storage node location.
//
// The following is a monkey-patch to account for that. It replaces `10.200.10.1` with whatever
// `formatConfigUrl` returns.

import formatConfigUrl from '$utils/formatConfigUrl'

export default function patchStorageNodeUrlGetter(stream) {
    // eslint-disable-next-line no-underscore-dangle
    const registry = stream._nodeRegistry

    const prevGetStorageNodeUrl = registry.getStorageNodeUrl.bind(registry)

    async function getStorageNodeUrl(address) {
        const url = await prevGetStorageNodeUrl(address)
        return url.replace('http://10.200.10.1:8891', formatConfigUrl(':8891'))
    }

    // eslint-disable-next-line no-underscore-dangle
    getStorageNodeUrl.__dockerHostPatch = true

    // eslint-disable-next-line no-underscore-dangle
    if (!registry.getStorageNodeUrl.__dockerHostPatch) {
        registry.getStorageNodeUrl = getStorageNodeUrl.bind(registry)
    }
}
