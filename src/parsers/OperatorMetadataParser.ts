import { z } from 'zod'
import getCoreConfig from '~/getters/getCoreConfig'

export const OperatorMetadataParser = z
    .string()
    .optional()
    .transform((value = '{}') => {
        try {
            return JSON.parse(value)
        } catch (e) {
            console.warn('Failed to parse metadata JSON. Is it JSON?', value, e)
        }

        return {}
    })
    .pipe(
        z
            .object({
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
            })
            .transform(({ imageIpfsCid, redundancyFactor, ...metadata }) => {
                const imageUrl = imageIpfsCid
                    ? `${getCoreConfig().ipfs.ipfsGatewayUrl}${imageIpfsCid}`
                    : undefined

                return {
                    ...metadata,
                    imageUrl,
                    imageIpfsCid,
                    redundancyFactor,
                }
            }),
    )
