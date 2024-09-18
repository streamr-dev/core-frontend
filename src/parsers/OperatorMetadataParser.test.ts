import {
    OperatorMetadataPreparser,
    parseOperatorMetadata,
} from './OperatorMetadataParser'

const emptyMetadata = {
    name: '',
    description: '',
    url: '',
    email: '',
    twitter: '',
    x: '',
    telegram: '',
    reddit: '',
    linkedIn: '',
}

describe('OperatorMetadataPreparser', () => {
    it('pre-parses undefined', () => {
        expect(OperatorMetadataPreparser.parse(undefined)).toMatchObject(emptyMetadata)
    })

    it('pre-parses an empty JSON object', () => {
        expect(OperatorMetadataPreparser.parse('{}')).toMatchObject(emptyMetadata)
    })

    it('pre-parses a JSON object with invalid urls', () => {
        expect(
            OperatorMetadataPreparser.parse(
                JSON.stringify({
                    name: 'NAME',
                    description: 'DESCRIPTION',
                    url: 'URL',
                    email: 'EMAIL',
                    twitter: 'TWITTER',
                    x: 'X',
                    telegram: 'TELEGRAM',
                    reddit: 'REDDIT',
                    linkedIn: 'LINKEDIN',
                    imageIpfsCid: 'foobar',
                    redundancyFactor: 2,
                }),
            ),
        ).toMatchObject({
            name: 'NAME',
            description: 'DESCRIPTION',
            url: '',
            email: '',
            twitter: '',
            x: '',
            telegram: '',
            reddit: '',
            linkedIn: '',
            imageIpfsCid: 'foobar',
            redundancyFactor: 2,
        })
    })

    it('pre-parses valid payload', () => {
        const valid = {
            name: 'NAME',
            description: 'DESCRIPTION',
            url: 'https://streamr.network/',
            email: 'contact@streamr.network',
            twitter: 'https://twitter.com/stream',
            x: 'https://x.com/streamr',
            telegram: 'https://telegram.org/blablabla',
            reddit: 'https://reddit.com/u/foobar',
            linkedIn: 'https://linkedin.com/streamr',
            imageIpfsCid: 'foobar',
            redundancyFactor: 2,
        }

        expect(OperatorMetadataPreparser.parse(JSON.stringify(valid))).toMatchObject(
            valid,
        )
    })
})

const options = {
    chainId: 137,
}

describe('parseOperatorMetadata', () => {
    function parse(payload: unknown) {
        return parseOperatorMetadata(
            OperatorMetadataPreparser.parse(JSON.stringify(payload)),
            options,
        )
    }

    it('parses valid payload', () => {
        expect(parse({ name: 'NAME' })).toMatchObject({
            name: 'NAME',
            imageIpfsCid: undefined,
            imageUrl: undefined,
        })

        expect(parse({ imageIpfsCid: 'foo' })).toMatchObject({
            imageIpfsCid: 'foo',
            imageUrl: 'https://streamr-hub.infura-ipfs.io/ipfs/foo',
        })
    })
})
