import { z } from 'zod'
import { address0 } from '~/consts'
import { getProjectImageUrl } from '~/getters'
import { getDataUnionAdminFeeForSalePoint } from '~/getters/du'
import { getChainConfigExtension } from '~/getters/getChainConfigExtension'
import { getCurrentChainId } from '~/getters/getCurrentChain'
import { getTokenInfo } from '~/hooks/useTokenInfo'
import { fromDecimals } from '~/marketplace/utils/math'
import { getMostRelevantTimeUnit } from '~/marketplace/utils/price'
import { getDataAddress } from '~/marketplace/utils/web3'
import { ProjectType, SalePoint } from '~/shared/types'
import {
    TimeUnit,
    timeUnitSecondsMultiplierMap,
    timeUnits,
} from '~/shared/utils/timeUnit'
import { getConfigForChain, getConfigForChainByName } from '~/shared/web3/config'
import { Chain } from '~/types'
import { toBN } from '~/utils/bn'

const ParsedPaymentDetail = z.object({
    beneficiary: z.string(),
    domainId: z.coerce.number(),
    pricePerSecond: z
        .string()
        .optional()
        .transform((v) => v || '0'),
    pricingTokenAddress: z.string(),
})

export type ParsedPaymentDetail = z.infer<typeof ParsedPaymentDetail>

const ProjectParser = z.object({
    id: z.union([z.string(), z.undefined()]),
    isDataUnion: z.boolean().optional().default(false),
    streams: z.array(z.string()).transform((streams) => streams.sort()),
    metadata: z
        .string()
        .transform((metadata) => JSON.parse(metadata))
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
                creator: z
                    .string()
                    .optional()
                    .transform((v) => v || ''),
                imageIpfsCid: z
                    .string()
                    .optional()
                    .transform((v) => v || undefined),
                imageUrl: z
                    .string()
                    .optional()
                    .transform((v) => v || undefined),
                termsOfUse: z
                    .object({
                        commercialUse: z.boolean().optional().default(false),
                        redistribution: z.boolean().optional().default(false),
                        reselling: z.boolean().optional().default(false),
                        storage: z.boolean().optional().default(false),
                        termsName: z.string().optional().default(''),
                        termsUrl: z.string().optional().default(''),
                    })
                    .optional()
                    .default({
                        commercialUse: false,
                        redistribution: false,
                        reselling: false,
                        storage: false,
                        termsName: '',
                        termsUrl: '',
                    }),
                contactDetails: z
                    .object({
                        url: z.string().optional().default(''),
                        email: z.string().optional().default(''),
                        twitter: z.string().optional().default(''),
                        telegram: z.string().optional().default(''),
                        reddit: z.string().optional().default(''),
                        linkedIn: z.string().optional().default(''),
                    })
                    .optional()
                    .default({
                        url: '',
                        email: '',
                        twitter: '',
                        telegram: '',
                        reddit: '',
                        linkedIn: '',
                    }),
            }),
        ),
    paymentDetails: z.array(ParsedPaymentDetail),
    permissions: z.array(
        z.object({
            canBuy: z.boolean().optional().default(false),
            canDelete: z.boolean().optional().default(false),
            canEdit: z.boolean().optional().default(false),
            canGrant: z.boolean().optional().default(false),
            userAddress: z.string(),
        }),
    ),
})

interface ParseProjectOptions {
    chainId: number
}

export function parseProject(value: unknown, options: ParseProjectOptions) {
    const { chainId } = options

    return ProjectParser.transform(
        async ({
            id,
            isDataUnion,
            streams,
            metadata: {
                contactDetails: contact,
                creator,
                description,
                imageIpfsCid,
                imageUrl,
                name,
                termsOfUse,
            },
            paymentDetails,
            permissions,
        }) => {
            const [payment, secondPayment] = paymentDetails

            const isOpenData = payment?.pricePerSecond === '0' && !secondPayment

            let adminFee: number | undefined

            if (isDataUnion) {
                try {
                    adminFee = await getDataUnionAdminFeeForSalePoint(payment)
                } catch (e) {
                    console.warn('Failed to load Data Union admin fee', e)
                }
            }

            const chains: Chain[] = getChainConfigExtension(
                chainId,
            ).marketplaceChains.map(getConfigForChainByName)

            const salePoints: Record<string, SalePoint | undefined> = {}

            chains.map(({ id, name: chainName }) => {
                salePoints[chainName] = {
                    beneficiaryAddress: '',
                    chainId: id,
                    enabled: false,
                    price: '',
                    pricePerSecond: '',
                    pricingTokenAddress: getDataAddress(id).toLowerCase(),
                    readOnly: false,
                    timeUnit: timeUnits.day,
                }
            })

            for (let i = 0; i < paymentDetails.length; i++) {
                try {
                    const { domainId, pricingTokenAddress, pricePerSecond, beneficiary } =
                        paymentDetails[i]

                    const { id: chainId, name: chainName } = getConfigForChain(
                        Number(domainId),
                    )

                    const { decimals } = await getTokenInfo(pricingTokenAddress, chainId)

                    const pricePerSecondFromDecimals = fromDecimals(
                        pricePerSecond,
                        decimals,
                    )

                    const timeUnit: TimeUnit = getMostRelevantTimeUnit(
                        pricePerSecondFromDecimals,
                    )

                    const multiplier = timeUnitSecondsMultiplierMap.get(timeUnit)

                    if (!multiplier) {
                        throw new Error('Invalid multiplier')
                    }

                    salePoints[chainName] = {
                        beneficiaryAddress: isOpenData
                            ? address0
                            : beneficiary.toLowerCase(),
                        chainId,
                        enabled: true,
                        price: pricePerSecondFromDecimals
                            .multipliedBy(multiplier)
                            .toString(),
                        pricePerSecond,
                        pricingTokenAddress: pricingTokenAddress.toLowerCase(),
                        readOnly: true,
                        timeUnit,
                    }
                } catch (e) {
                    console.warn(
                        'Could not convert a payment details into a sale point',
                        e,
                    )
                }
            }

            return {
                adminFee:
                    typeof adminFee === 'undefined'
                        ? ''
                        : toBN(adminFee).multipliedBy(100).toString(),
                chainId,
                contact,
                creator,
                description,
                id,
                imageIpfsCid,
                imageUrl: getProjectImageUrl(chainId, { imageUrl, imageIpfsCid }),
                isDataUnion,
                name,
                newImageToUpload: undefined,
                paymentDetails,
                permissions,
                salePoints,
                streams,
                termsOfUse,
                type: isDataUnion
                    ? ProjectType.DataUnion
                    : isOpenData
                    ? ProjectType.OpenData
                    : ProjectType.PaidData,
            }
        },
    ).parseAsync(value)
}

export type ParsedProject = Awaited<ReturnType<typeof parseProject>>

function getEmptySalePoints(chainId: number) {
    const chains: Chain[] = getChainConfigExtension(chainId).marketplaceChains.map(
        getConfigForChainByName,
    )

    const salePoints: Record<string, SalePoint | undefined> = {}

    chains.map(({ id, name: chainName }) => {
        salePoints[chainName] = {
            beneficiaryAddress: '',
            chainId: id,
            enabled: false,
            price: '',
            pricePerSecond: '',
            pricingTokenAddress: getDataAddress(id).toLowerCase(),
            readOnly: false,
            timeUnit: timeUnits.day,
        }
    })

    return salePoints
}

interface GetEmptyParsedProjectOptions {
    type: ProjectType
    chainId?: number
}

export function getEmptyParsedProject({
    chainId: chainIdProp,
    ...options
}: GetEmptyParsedProjectOptions): ParsedProject {
    const chainId = chainIdProp ?? getCurrentChainId()

    return {
        chainId,
        adminFee: '',
        contact: {
            url: '',
            email: '',
            twitter: '',
            telegram: '',
            reddit: '',
            linkedIn: '',
        },
        creator: '',
        description: '',
        id: undefined,
        imageIpfsCid: undefined,
        imageUrl: undefined,
        isDataUnion: false,
        name: '',
        newImageToUpload: undefined,
        paymentDetails: [],
        permissions: [],
        salePoints: getEmptySalePoints(chainId),
        streams: [],
        termsOfUse: {
            commercialUse: false,
            redistribution: false,
            reselling: false,
            storage: false,
            termsName: '',
            termsUrl: '',
        },
        ...options,
    }
}
