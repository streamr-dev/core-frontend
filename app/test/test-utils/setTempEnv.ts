export default function setTempEnv(variables = {}): any {
    let env: any;
    beforeEach(() => {
        env = { ...process.env }
        Object.assign(process.env, variables)
        jest.resetModules()
    })
    afterEach(() => {
        Object.assign(process, {
            env,
        })
    })
}
