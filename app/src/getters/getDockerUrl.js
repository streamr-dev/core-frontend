export default function getDockerUrl() {
    return `http://${process.env.STREAMR_DOCKER_DEV_HOST || 'localhost'}`
}
