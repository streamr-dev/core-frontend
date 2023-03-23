import BN from "bignumber.js"
import {TheGraphPaymentDetails, TheGraphProject} from "$app/src/services/projects"
import {ChainName, Project, SalePoint} from "$mp/types/project-types"
import {ProjectTypeEnum} from "$mp/utils/constants"
import {getConfigForChain} from "$shared/web3/config"
import {getMostRelevantTimeUnit} from "$mp/utils/price"
import {getTokenInformation} from "$mp/utils/web3"
import {fromDecimals} from "$mp/utils/math"
import {TimeUnit, timeUnitSecondsMultiplierMap} from "$shared/utils/timeUnit"

export const mapGraphProjectToDomainModel = async (graphProject: TheGraphProject): Promise<Project> => {
    return {
        id: graphProject.id,
        type: mapProjectType(graphProject),
        name: graphProject.metadata.name,
        description: graphProject.metadata.description,
        creator: graphProject.metadata.creator,
        imageUrl: graphProject.metadata.imageUrl,
        streams: graphProject.streams,
        termsOfUse: {...graphProject.metadata.termsOfUse},
        contact: {...graphProject.metadata.contactDetails},
        salePoints: await mapSalePoints(graphProject.paymentDetails)
    }
}

export const mapProjectType = (graphProject: TheGraphProject): ProjectTypeEnum => {
    // TODO when the TheGraphProject will have field which determines if it's a Data Union - implement a check here
    return graphProject.paymentDetails.length === 1 && graphProject.paymentDetails[0].pricePerSecond == '0'
        ? ProjectTypeEnum.OPEN_DATA
        : ProjectTypeEnum.PAID_DATA
}

export const mapSalePoints = async (paymentDetails: TheGraphPaymentDetails[]): Promise<Record<ChainName, SalePoint>> => {
    const salePoints: Record<ChainName, SalePoint> = {}
    await Promise.all(paymentDetails.map(async (paymentDetail) => {
        const chainConfig = getConfigForChain(Number(paymentDetail.domainId))
        const tokenInfo = await getTokenInformation(paymentDetail.pricingTokenAddress, chainConfig.id)
        const pricePerSecondFromDecimals = fromDecimals(paymentDetail.pricePerSecond, String(tokenInfo.decimals))
        const timeUnit: TimeUnit = getMostRelevantTimeUnit(pricePerSecondFromDecimals)
        salePoints[chainConfig.name] = {
            chainId: chainConfig.id,
            pricingTokenAddress: paymentDetail.pricingTokenAddress.toLowerCase(),
            pricePerSecond: new BN(paymentDetail.pricePerSecond),
            beneficiaryAddress: paymentDetail.beneficiary.toLowerCase(),
            timeUnit,
            price: pricePerSecondFromDecimals.multipliedBy(timeUnitSecondsMultiplierMap.get(timeUnit))
        }
    }))
    return salePoints
}

export const mapProjectTypeName = (projectType: ProjectTypeEnum): string => {
    switch (projectType) {
        case ProjectTypeEnum.OPEN_DATA:
            return 'Open data'
            break
        case ProjectTypeEnum.DATA_UNION:
            return 'Data Union'
            break
        case ProjectTypeEnum.PAID_DATA:
            return 'Paid data'
            break
        default:
            return 'Project'
            break
    }
}
