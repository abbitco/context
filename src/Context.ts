import slugify from "slugify";
import ILogger from './ILogger'

declare type ContextOptions = {
    logger: ILogger
}

export default class Context {
    static logger: ILogger | undefined;
    static ctx: Context;

    module: string = 'main';

    log: ILogger;
    params: { [key: string]: any } = {};
    dryRun = true;

    constructor(ctx: Context = {} as Context) {
        if (!Context.logger) {
            throw new Error('Context.init needs to be called before new Contexts can be created');
        }

        this.log = Context.logger.child({module: this.module});
        Object.assign(this, ctx);
    }

    static init(options: ContextOptions) {
        Context.logger = options.logger;
    }

    static createContext(module: string = 'main') {
        return new Context({module} as Context);
    }

    /**
     * Creates a child context with a child logger
     *
     * @param loggerOptions
     * @returns {Context}
     */
    child(loggerOptions: { [key: string]: any } = {}): Context {
        const localOptions = {...loggerOptions};
        if (localOptions.module) {
            localOptions.module = `${this.module}::${localOptions.module}`
        }
        return new Context({...this, log: this.log.child(localOptions, true)});
    }

    /**
     * Runs the function passed in if dryRun is strictly equal to false. undefined or falsy values wont trigger a run.
     * Leaves a papertrail either way.
     *
     * @param fn
     * @param name
     * @param logExtras
     * @returns {boolean|*}
     */
    run(fn: Function, name: string, logExtras: Object = {}) {
        if (this.dryRun === false) {
            this.log.info({[`${slugify(name)}-params`]: logExtras}, 'Running: %s', name);
            return fn();
        } else {
            this.log.info({[`${slugify(name)}-params`]: logExtras}, 'Dry run, skipping: %s', name);
            return false;
        }
    }
};
