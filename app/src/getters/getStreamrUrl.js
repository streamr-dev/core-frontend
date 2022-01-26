export default function getStreamrUrl() {
    return process.env.STREAMR_URL || `http://${process.env.STREAMR_DOCKER_DEV_HOST || 'localhost'}`
}
