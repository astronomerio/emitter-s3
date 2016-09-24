import { createLogger  } from 'bunyan';

const logDir = process.env.NODE_LOG_DIR !== undefined
    ? process.env.NODE_LOG_DIR
    : ".";

const options = {
    name: 'astronomerio:emitter-s3',
    streams: [{
        level: 'trace',
        path: `${logDir}/app.log`
    }]
};

export default createLogger(options);
