import { ConfigTest } from 'streamr-client'

export default function getGraphApiUrl() {
    return process.env.GRAPH_API_URL || ConfigTest.theGraphUrl
}
