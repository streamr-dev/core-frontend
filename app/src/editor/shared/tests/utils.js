import Wallet from 'ethereumjs-wallet'
import StreamrClient from 'streamr-client'
import { setToken } from '$shared/utils/sessionToken'
import * as Services from '../services'

/**
 * Creates a client for a new, generated user.
 */

function createNewUserClient() {
    const generatedWallet = Wallet.generate()
    const privateKey = generatedWallet.getPrivateKeyString()

    const client = new StreamrClient({
        auth: {
            privateKey,
        },
        url: process.env.STREAMR_WS_URL,
        restUrl: process.env.STREAMR_API_URL,
        autoConnect: false,
        autoDisconnect: false,
    })

    return client
}

/**
 * Add session token
 */

export async function setupAuthorizationHeader() {
    const client = await createNewUserClient()
    await client.connect()
    const sessionToken = await client.session.getSessionToken() // returns a Promise that resolves with session token

    setToken(sessionToken)

    return async () => {
        setToken(null)

        if (client && client.connection) {
            await client.disconnect()
        }
    }
}

let modulesCache

async function getModules() {
    if (modulesCache) { return modulesCache }
    modulesCache = new Map()
    const modules = await Services.getModules()
    modules.forEach((m) => {
        if (modulesCache.has(m.name)) {
            throw new Error(`Duplicate module name: ${m.name}`)
        }
        modulesCache.set(m.name, m.id)
    })
    return modulesCache
}

export async function loadModuleDefinition(name) {
    const modules = await getModules()
    return Services.getModule({
        id: modules.get(name),
    })
}
