import { z } from 'zod'
import { getGraphUrl } from '~/getters'
import { post } from '~/shared/utils/api'
import { GraphProject } from '~/shared/consts'

export async function fetchGraphProjectForPurchase(projectId: string) {
    const result = await post({
        url: getGraphUrl(),
        data: {
            query: `
                query {
                    projects(
                        where: { id: "${projectId.toLowerCase()}" }
                    ) {
                        streams
                        paymentDetails {
                            domainId
                            beneficiary
                            pricingTokenAddress
                            pricePerSecond
                        }
                    }
                }
            `,
        },
    })

    try {
        const [project = undefined] = z
            .object({
                data: z.object({
                    projects: z.array(
                        GraphProject.pick({ paymentDetails: true, streams: true }),
                    ),
                }),
            })
            .parse(result).data.projects

        return project
    } catch (e) {
        console.warn(e)
    }
}

export async function fetchGraphProjectSubscriptions(projectId: string) {
    const result = await post({
        url: getGraphUrl(),
        data: {
            query: `
                query {
                    projects(
                        where: { id: "${projectId.toLowerCase()}" }
                    ) {
                        subscriptions {
                            userAddress
                            endTimestamp
                        }
                    }
                }
            `,
        },
    })

    try {
        const [project = undefined] = z
            .object({
                data: z.object({
                    projects: z.array(GraphProject.pick({ subscriptions: true })),
                }),
            })
            .parse(result).data.projects

        return project?.subscriptions || []
    } catch (e) {
        console.warn(e)
    }

    return []
}
