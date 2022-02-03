export default function setTempEnv(variables = {}) {
    let env

    beforeEach(() => {
        env = {
            ...process.env,
        }
        Object.assign(process.env, variables)
        jest.resetModules()
    })

    afterEach(() => {
        Object.assign(process, {
            env,
        })
    })
}
