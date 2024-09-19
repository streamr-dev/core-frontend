import { z } from 'zod'
import { Parsable } from '~/parsers/Parsable'
import { getChainConfigExtension } from '~/utils/chains'

const RawOperatorMetadata = z
    .string()
    .default('{}')
    .transform((value) => {
        try {
            return JSON.parse(value)
        } catch (e) {
            if (e instanceof SyntaxError) {
                return {}
            }

            throw e
        }
    })
    .pipe(
        z.record(
            z.union([
                z.literal('name'),
                z.literal('description'),
                z.literal('imageIpfsCid'),
                z.literal('redundancyFactor'),
                z.literal('url'),
                z.literal('email'),
                z.literal('twitter'),
                z.literal('x'),
                z.literal('telegram'),
                z.literal('reddit'),
                z.literal('linkedIn'),
            ]),
            z.unknown(),
        ),
    )

type RawOperatorMetadata = z.infer<typeof RawOperatorMetadata>

const UrlParser = z
    .string()
    .url()
    .optional()
    .catch(() => undefined)
    .default('')

export class OperatorMetadata extends Parsable<RawOperatorMetadata> {
    static parse(raw: unknown, chainId: number): OperatorMetadata {
        return new OperatorMetadata(raw, chainId)
    }

    protected preparse() {
        return RawOperatorMetadata.parse(this.raw)
    }

    get name() {
        return this.getValue('name', (raw) => {
            return z
                .string()
                .catch(() => '')
                .parse(raw)
        })
    }

    get description() {
        return this.getValue('description', (raw) => {
            return z
                .string()
                .catch(() => '')
                .parse(raw)
        })
    }

    get imageIpfsCid() {
        return this.getValue('imageIpfsCid', (raw) => {
            return z
                .string()
                .trim()
                .optional()
                .catch(() => undefined)
                .transform((v) => v || undefined)
                .parse(raw)
        })
    }

    get imageUrl() {
        const { imageIpfsCid, chainId } = this

        const { ipfsGatewayUrl } = getChainConfigExtension(chainId).ipfs

        return imageIpfsCid && `${ipfsGatewayUrl}${imageIpfsCid}`
    }

    get redundancyFactor() {
        return this.getValue('redundancyFactor', (raw) => {
            return z.coerce
                .number()
                .int()
                .min(1)
                .optional()
                .catch(() => undefined)
                .parse(raw)
        })
    }

    get url() {
        return this.getValue('url', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get email() {
        return this.getValue('email', (raw) => {
            return z
                .string()
                .email()
                .optional()
                .catch(() => undefined)
                .default('')
                .parse(raw)
        })
    }

    get twitter() {
        return this.getValue('twitter', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get x() {
        return this.getValue('x', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get telegram() {
        return this.getValue('telegram', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get reddit() {
        return this.getValue('reddit', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get linkedIn() {
        return this.getValue('linkedIn', (raw) => {
            return UrlParser.parse(raw)
        })
    }
}
