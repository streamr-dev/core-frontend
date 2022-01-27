export default function getPlatformOriginUrl() {
    return process.env.PLATFORM_ORIGIN_URL || `http://${process.env.STREAMR_DOCKER_DEV_HOST}`
}
