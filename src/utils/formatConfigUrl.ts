interface FormatConfigUrlOptions {
    protocol?: string
    dockerHost?: string
}

export default function formatConfigUrl(
    url: string,
    options: FormatConfigUrlOptions = {},
): string {
    const { protocol = 'http' } = options

    const dockerHost = process.env.STREAMR_DOCKER_DEV_HOST || options.dockerHost

    // Config contains references to local docker environment (10.200.10.1).
    // Make sure we are compatible with other docker hosts as well.
    if (url.includes('10.200.10.1') && dockerHost != null) {
        url = url.replace('10.200.10.1', dockerHost)
    }

    return !/^[:/]/.test(url) ? url : `${protocol}://${dockerHost}${url}`
}
