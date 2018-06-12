export function createLink(optsOrController, action, id) {
    const projectWebroot = `${window.location.origin}/`
    let opts = optsOrController

    if (action) {
        opts = {
            controller: optsOrController,
            action,
            id,
        }
    }

    if (opts.uri) {
        return projectWebroot + opts.uri.replace(/^\//, '')
    }

    const ctrl = opts.controller[0].toLowerCase() + opts.controller.slice(1)
    let url = projectWebroot + ctrl

    if (opts.action) {
        url += `/${opts.action}`
    }

    if (opts.id !== undefined) {
        url += `/${opts.id}`
    }

    return url
}

export default (uri) => createLink({
    uri,
})
