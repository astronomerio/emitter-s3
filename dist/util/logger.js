'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bunyan = require('bunyan');

var logDir = process.env.NODE_LOG_DIR !== undefined ? process.env.NODE_LOG_DIR : ".";

var options = {
    name: 'astronomerio:emitter-s3',
    streams: [{
        level: 'trace',
        path: logDir + '/app.log'
    }]
};

exports.default = (0, _bunyan.createLogger)(options);