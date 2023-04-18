import getCoreConfig from './getCoreConfig'

export function getGraphUrl() {
    const { theGraphUrl, theHubGraphName } = getCoreConfig()

    return `${theGraphUrl}/subgraphs/name/${theHubGraphName}`
}
