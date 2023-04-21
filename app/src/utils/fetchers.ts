import { getGraphUrl } from '$app/src/getters'
import { post } from '$shared/utils/api'
import { GraphProject } from '$shared/consts'
import { z } from 'zod'

export async function fetchGraphProjectForPurchase(projectId: string) {
    const result = await post({
        url: getGraphUrl(),
        data: {
            query: `
                query {
                    projects(
                        where: { id: "${projectId.toLowerCase()}" }
                    ) {
                        id
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
