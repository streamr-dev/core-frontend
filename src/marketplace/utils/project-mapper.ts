import { TheGraphPaymentDetails, TheGraphProject } from '~/services/projects'
import { ChainName, Project, SalePoint } from '~/marketplace/types/project-types'
import { ProjectType } from '~/shared/types'
import { getConfigForChain } from '~/shared/web3/config'
import { getMostRelevantTimeUnit } from '~/marketplace/utils/price'
import { getTokenInfo } from '~/hooks/useTokenInfo'
import { fromDecimals } from '~/marketplace/utils/math'
import { TimeUnit, timeUnitSecondsMultiplierMap } from '~/shared/utils/timeUnit'
import getCoreConfig from '~/getters/getCoreConfig'
import { toBN } from '~/utils/bn'

/**
 * @deprecated Use `getProjectImageUrl`.
 */
export const mapImageUrl = (graphProject: TheGraphProject) => {
    const { ipfs } = getCoreConfig()
    const { ipfsGatewayUrl } = ipfs

    // @ts-expect-error 2339: Metadata might contain old imageUrl property
    let imageUrl = graphProject.metadata.imageUrl as string
    if (graphProject.metadata.imageIpfsCid) {
        imageUrl = ipfsGatewayUrl + graphProject.metadata.imageIpfsCid
    }

    // Replace old ipfs.io references with new IPFS gateway
    if (imageUrl != null && imageUrl.startsWith('https://ipfs.io/ipfs/')) {
        imageUrl = imageUrl.replace('https://ipfs.io/ipfs/', ipfsGatewayUrl)
    }

    return imageUrl
}

/**
 * @deprecated Use `projectEditor` to obtain both the graph projects and their local reflections.
 */
export const mapGraphProjectToDomainModel = async (
    graphProject: TheGraphProject,
): Promise<Project> => {
    return {
        id: graphProject.id,
        type: mapProjectType(graphProject),
        name: graphProject.metadata.name,
        description: graphProject.metadata.description,
        creator: graphProject.metadata.creator,
        imageUrl: mapImageUrl(graphProject),
        imageIpfsCid: graphProject.metadata.imageIpfsCid,
        streams: graphProject.streams,
        termsOfUse: { ...graphProject.metadata.termsOfUse },
        contact: { ...graphProject.metadata.contactDetails },
        salePoints: await mapSalePoints(graphProject.paymentDetails),
    }
}

/**
 * @deprecated Use `projectEditor` to obtain both the graph projects and their local reflections.
 */
export const mapProjectType = (graphProject: TheGraphProject): ProjectType => {
    if (graphProject.isDataUnion) {
        return ProjectType.DataUnion
    }
    return graphProject.paymentDetails.length === 1 &&
        graphProject.paymentDetails[0].pricePerSecond == '0'
        ? ProjectType.OpenData
        : ProjectType.PaidData
}

/**
 * @deprecated Use `projectEditor` to obtain both the graph projects and their local reflections.
 */
export const mapSalePoints = async (
    paymentDetails: TheGraphPaymentDetails[],
): Promise<Record<ChainName, SalePoint>> => {
    const salePoints: Record<ChainName, SalePoint> = {}
    await Promise.all(
        paymentDetails.map(async (paymentDetail) => {
            const chainConfig = getConfigForChain(Number(paymentDetail.domainId))
            const tokenInfo = await getTokenInfo(
                paymentDetail.pricingTokenAddress,
                chainConfig.id,
            )

            if (!tokenInfo) {
                throw new Error(
                    `"${paymentDetail.pricingTokenAddress}" is not an ERC-20 token`,
                )
            }

            const pricePerSecondFromDecimals = fromDecimals(
                paymentDetail.pricePerSecond,
                String(tokenInfo.decimals),
            )
            const timeUnit: TimeUnit = getMostRelevantTimeUnit(pricePerSecondFromDecimals)
            salePoints[chainConfig.name] = {
                chainId: chainConfig.id,
                pricingTokenAddress: paymentDetail.pricingTokenAddress.toLowerCase(),
                pricePerSecond: toBN(paymentDetail.pricePerSecond),
                beneficiaryAddress: paymentDetail.beneficiary.toLowerCase(),
                timeUnit,
                price: pricePerSecondFromDecimals.multipliedBy(
                    timeUnitSecondsMultiplierMap.get(timeUnit),
                ),
            }
        }),
    )
    return salePoints
}
