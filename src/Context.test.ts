import Context from "./Context";
import {createLogger} from 'bunyan';
import {LoggingBunyan} from '@abbit/bunyan-cloud-function';

describe('ctx', () => {
    beforeEach(() => {
        const loggingBunyan = new LoggingBunyan();

        const logger = createLogger({
            name: 'test',
            streams: [
                loggingBunyan.stream(0),
            ],
        });

        Context.init({logger});
    })

    it('Should log all error levels', () => {
        let ctx = Context.createContext();
        const data = {
            hey: 'asdf',
            ho: 123,
        };
        ctx.log.trace(data, "Hello logs!");
        ctx.log.debug(data, "Hello logs!");
        ctx.log.info(data, "Hello logs!");
        ctx.log.warn(data, "Hello logs!");
        ctx.log.error(data, "Hello logs!");
        ctx.log.fatal(data, "Hello logs!");
    })

    it('Should work with dryRun true', () => {
        let ctx = Context.createContext();
        ctx.run(() => {
            return true
        }, 'test dry run', {lets: 'yay'});

    })

    it('Should work with dryRun false', () => {
        let ctx = Context.createContext();
        ctx = ctx.child();
        ctx.dryRun = false;

        ctx.run(() => {
            return true
        }, 'test dr.false', {go: 'yay'});
    })

    it('Should inherit scope', () => {
        let ctx = Context.createContext();
        ctx = ctx.child({module: 'uhul'});
        ctx.log.info({hey: 'ho'}, "Hello logs!");
    })

})
