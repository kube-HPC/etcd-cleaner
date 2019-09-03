const configIt = require('@hkube/config');
const Logger = require('@hkube/logger');
const { main, logger } = configIt.load();
const config = main;
const log = new Logger(config.serviceName, logger);
const component = require('./lib/consts/components').MAIN;

class Bootstrap {
    async init() {
        try {
            this._handleErrors();
            log.info(`running application with env: ${configIt.env()}, version: ${config.version}, node: ${process.versions.node}`, { component });

            const sources = config.sources.replace(/\s/g, '').split(',').filter(s => s);

            if (sources.length === 0) {
                throw new Error('there are no sources to clean');
            }
            log.info(`starting cleaner with ${sources}`, { component });

            for (const source of sources) {
                try {
                    log.info(`loading ${source} cleaner`, { component });
                    const cleaner = require(`./lib/cleaners/${source}`);
                    log.info(`starting ${source} cleaner`, { component });
                    await cleaner.clean(config, source);
                    log.info(`finish ${source} cleaner`, { component });
                }
                catch (error) {
                    log.error(error.message, { component }, error);
                }
            }
            log.info(`finish cleaner with ${sources}`, { component });
            // process.exit(0); // MAYBE AUTOCLEAN ON EXIT
        }
        catch (error) {
            this._onInitFailed(error);
        }
    }

    _onInitFailed(error) {
        log.error(error.message, { component }, error);
        process.exit(1);
    }

    _handleErrors() {
        process.on('exit', (code) => {
            log.info(`exit code ${code}`, { component });
        });
        process.on('SIGINT', () => {
            log.info('SIGINT', { component });
            process.exit(0);
        });
        process.on('SIGTERM', () => {
            log.info('SIGTERM', { component });
            process.exit(0);
        });
        process.on('unhandledRejection', (error) => {
            log.error(`unhandledRejection: ${error.message}`, { component }, error);
            process.exit(1);
        });
        process.on('uncaughtException', (error) => {
            log.error(`uncaughtException: ${error.message}`, { component }, error);
            process.exit(1);
        });
    }
}

module.exports = new Bootstrap();

