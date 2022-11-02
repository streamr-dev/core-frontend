// TODO add typing
export default (form: any, opt: any): any => {
    if (!opt || !opt.hash) {
        throw new Error('hash: true required')
    }

    return form
}
