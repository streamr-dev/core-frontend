export class ModuleError extends Error {
    moduleErrors = []

    constructor(message = 'ModuleError', moduleErrors = [], ...args) {
        super(message, ...args)

        this.moduleErrors = moduleErrors || []

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ModuleError)
        }

        // This is because of some bug in babel (https://github.com/babel/babel/issues/4485)
        Object.setPrototypeOf(this, ModuleError.prototype)
    }
}

export default ModuleError
