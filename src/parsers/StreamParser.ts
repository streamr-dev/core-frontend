import { PermissionAssignment, StreamMetadata, StreamPermission } from 'streamr-client'
import { z } from 'zod'
import { address0 } from '~/consts'
import { parseStreamId } from '~/shared/utils/text'

const StreamParser = z.object({
    id: z.string().or(z.undefined()),
})

interface ParseStreamOptions {
    chainId: number
    metadata?: StreamMetadata
    permissionAssignments?: PermissionAssignment[]
    storageNodes?: string[]
}

export function parseStream(value: unknown, options: ParseStreamOptions) {
    return StreamParser.transform(({ id }) => {
        const { owner = '', pathname = '' } = id ? parseStreamId(id) : {}

        const {
            storageNodes = [],
            permissionAssignments = [],
            metadata,
            ...rest
        } = options

        const storage: Record<string, boolean | null | undefined> = {}

        storageNodes.forEach((address) => {
            storage[address.toLowerCase()] = true
        })

        const permissions: Record<string, number | null | undefined> = {}

        permissionAssignments.forEach((assignment) => {
            const user = 'user' in assignment ? assignment.user.toLowerCase() : address0

            permissions[user] = assignment.permissions.reduce(
                (memo, permission) => memo | Bits[permission],
                permissions[user] || 0,
            )
        })

        return {
            ...rest,
            domain: owner,
            id,
            metadata: parseStreamMetadata(metadata),
            pathname: pathname.replace(/^\//, ''),
            permissions,
            storage,
        }
    }).parse(value)
}

export type ParsedStream = ReturnType<typeof parseStream>

export const Bits: Record<StreamPermission, number> = {
    [StreamPermission.DELETE]: /*    */ 1 << 0,
    [StreamPermission.EDIT]: /*      */ 1 << 1,
    [StreamPermission.GRANT]: /*     */ 1 << 2,
    [StreamPermission.PUBLISH]: /*   */ 1 << 3,
    [StreamPermission.SUBSCRIBE]: /* */ 1 << 4,
}

export function setBits(bitsA: number, bitsB: number) {
    return (bitsA |= bitsB)
}

export function unsetBits(bitsA: number, bitsB: number) {
    return (bitsA &= ~bitsB)
}

export function matchBits(bitsA: number, bitsB: number) {
    return (bitsA & bitsB) === bitsA
}

function parseStreamMetadata(metadata: unknown) {
    return z
        .object({
            partitions: z.coerce.string().optional().default('1'),
            description: z.string().optional().default(''),
            storageDays: z.coerce.string().optional().default(''),
            inactivityThresholdHours: z.coerce.string().optional().default(''),
        })
        .parse(metadata)
}
