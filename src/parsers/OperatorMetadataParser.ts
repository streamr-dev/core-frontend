import { z } from 'zod'
import { getChainConfigExtension } from '~/utils/chains'

export const OperatorMetadataPreparser = z
    .string()
    .optional()
    .default('{}')
    .transform((value) => {
        try {
            return JSON.parse(value)
        } catch (e) {
            console.warn('Failed to parse metadata JSON. Is it JSON?', value, e)
        }

        return {}
    })
    .pipe(
        z.object({
            name: z
                .string()
                .optional()
                .transform((v) => v || ''),
            description: z
                .string()
                .optional()
                .transform((v) => v || ''),
            imageIpfsCid: z.string().optional(),
            redundancyFactor: z.coerce.number().optional(),
        }),
    )

type OperatorMetadataPreparser = z.infer<typeof OperatorMetadataPreparser>

interface ParseOperatorMetadataOptions {
    chainId: number
}

export function parseOperatorMetadata(
    value: OperatorMetadataPreparser,
    options: ParseOperatorMetadataOptions,
) {
    const { chainId } = options

    const { imageIpfsCid, ...metadata } = value

    const { ipfsGatewayUrl } = getChainConfigExtension(chainId).ipfs

    const imageUrl = imageIpfsCid ? `${ipfsGatewayUrl}${imageIpfsCid}` : undefined

    return {
        ...metadata,
        imageUrl,
        imageIpfsCid,
    }
}
