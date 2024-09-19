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
    protected preparse() {
        return RawOperatorMetadata.parse(this.raw)
    }

    name() {
        return this.getValue('name', (raw) => {
            return z
                .string()
                .catch(() => '')
                .parse(raw)
        })
    }

    description() {
        return this.getValue('description', (raw) => {
            return z
                .string()
                .catch(() => '')
                .parse(raw)
        })
    }

    imageIpfsCid() {
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

    imageUrl() {
        const { ipfsGatewayUrl } = getChainConfigExtension(this.chainId).ipfs

        const imageIpfsCid = this.imageIpfsCid()

        return imageIpfsCid && `${ipfsGatewayUrl}${imageIpfsCid}`
    }

    redundancyFactor() {
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

    url() {
        return this.getValue('url', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    email() {
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

    twitter() {
        return this.getValue('twitter', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    x() {
        return this.getValue('x', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    telegram() {
        return this.getValue('telegram', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    reddit() {
        return this.getValue('reddit', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    linkedIn() {
        return this.getValue('linkedIn', (raw) => {
            return UrlParser.parse(raw)
        })
    }
}
