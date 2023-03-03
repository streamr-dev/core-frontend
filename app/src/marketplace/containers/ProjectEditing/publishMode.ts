export enum PublishMode {
    REPUBLISH = 'republish',
    // live product update
    REDEPLOY = 'redeploy',
    // unpublished, but published at least once
    PUBLISH = 'publish',
    // unpublished, publish for the first time
    UNPUBLISH = 'unpublish',
    ERROR = 'error',
}
