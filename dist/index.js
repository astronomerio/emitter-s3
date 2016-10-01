'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _thenify = require('thenify');

var _thenify2 = _interopRequireDefault(_thenify);

var _highland = require('highland');

var _highland2 = _interopRequireDefault(_highland);

var _stream = require('stream');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _createAwsParams = require('./util/createAwsParams');

var _createAwsParams2 = _interopRequireDefault(_createAwsParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        var filePath = options.filePath;
        var appendTimestampToFilename = options.appendTimestampToFilename;

        this.filePath = filePath || '';
        this.appendTimestampToFilename = appendTimestampToFilename === false ? false : true;

        var awsParams = (0, _createAwsParams2.default)(options);
        this.client = this.createClient(awsParams);
    }

    _createClass(_class, [{
        key: 'createClient',
        value: function createClient(params) {
            var client = new _awsSdk2.default.S3(params);
            return client;
        }

        /**
         * Takes the file path from options passed in the constructor and appends a timestamp as the filename.
         * @returns {String} filePath The filePath that will where the file lives in S3.
         */

    }, {
        key: 'getS3FilePath',
        value: function getS3FilePath() {
            if (this.appendTimestampToFilename) {
                var filename = new Date().toISOString();
                var filePath = _path2.default.join(this.filePath, filename);
                return filePath;
            }

            return this.filePath;
        }

        /**
         * Wraps the records in a highland stream and seperates by newline so we can stream to S3 a document of newline delimited JSON objects.
         * @param {Array} records The array of JSON objects to be put to S3.
         */

    }, {
        key: 'getUploadBody',
        value: function getUploadBody(records) {
            return (0, _highland2.default)(records).map(JSON.stringify).intersperse('\n');
        }
    }, {
        key: 'emit',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(records) {
                var filePath, uploadBody;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                filePath = this.getS3FilePath();
                                uploadBody = this.getUploadBody(records);


                                _logger2.default.info('uploading file ' + filePath + ' to s3');
                                _context.next = 5;
                                return this.uploadRecords(filePath, uploadBody);

                            case 5:
                                _logger2.default.info('successfully uploaded ' + filePath + ' to s3');

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function emit(_x) {
                return _ref.apply(this, arguments);
            }

            return emit;
        }()
    }, {
        key: 'uploadRecords',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(filePath, uploadBody) {
                var upload;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                upload = (0, _thenify2.default)(this.client.upload).bind(this.client);
                                _context2.next = 3;
                                return upload({ Key: filePath, Body: uploadBody.pipe(new _stream.PassThrough()) });

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function uploadRecords(_x2, _x3) {
                return _ref2.apply(this, arguments);
            }

            return uploadRecords;
        }()
    }]);

    return _class;
}();

exports.default = _class;
;