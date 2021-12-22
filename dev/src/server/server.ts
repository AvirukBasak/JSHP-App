'use strict';

import * as HTTP from 'http';
import * as URL from 'url';
import * as FS from 'fs';

import { DefConfig, } from '../config/config';
import {
    getLongDateTime,
    writeLogs,
    getHTMLerrMessage,
    string,
    number,
} from '../common/common';
import { initMethods, GET, POST, PUT, DELETE, OPTIONS } from './methods';

/**
 * Listens at port and returns static files / parsed JSHP HTML files.
 * @param {string} host The host to listen to.
 * @param {number} port Port where server will listen.
 * @param {string} resource_root Path from where files will be served.
 * @param {string} logfile Path to log file.
 */
export const startServer = function(host: string, port: number, resource_root: string, logfile: string): void {

    // Loads configuration data from config.json file or config.ts.
    const Config = FS.existsSync(resource_root + '/config.json') ?
                       { ...DefConfig, ...JSON.parse(string(FS.readFileSync(resource_root + '/config.json'))) } : DefConfig;

    // loads passed param into Config object
    if (resource_root) Config.resource_root = resource_root;
    if (logfile) Config.log_path = resource_root + '/' + logfile;
    else Config.log_path = resource_root + '/' + Config.log_path;

    // loads data from Config to local variables
    logfile = Config.log_path;

    // if set to false
    if (!Config.trailing_slashes) {
        // insert '/' to beginning of array, directories always gain preference over file extensions
        Config.no_extension.splice(0, 0, '/');
    }

    // indexes rewrites
    Config.rewriteList = [];
    for (const rwrt of Config.rewrites) {
        Config.rewriteList.push(rwrt.req);
    }

    // indexes redirects
    Config.redirectList = [];
    for (const rdir of Config.redirects) {
        Config.redirectList.push(rdir.req);
    }

    // initializes http methods
    initMethods(Config);

    /**
     * Get path to err_file if it exists, otherwise res.end with error code.
     */
    const putHTTPError = function(
        req: HTTP.IncomingMessage,             // HTTP request
        res: HTTP.ServerResponse,              // HTTP response
        resource_root: string,                 // root of server resources
        log_msg: string                        // error log message
    ): void {
        writeLogs(req, res, logfile, log_msg);
        const err_filepath = resource_root + '/' + Config.err_files[string(res.statusCode)];
        if (Config.err_files[string(res.statusCode)] && FS.existsSync(err_filepath)) {
            GET(err_filepath, req, res);
        } else {
            res.end();
        }
    }

    HTTP.createServer(function(req, res) {

        // loads pathname from request
        let pathname = URL.parse(req.url || '', true).pathname || '/';

        // get query string from request
        const query_str: string = (function(): string {
            if (req.url?.indexOf('?') === -1) return '';
            else return req.url?.substring(req.url?.indexOf('?')) || '';
        })();

        // replaces ../ with /, and excess ///// with a single /
        pathname = pathname.replace(/\.{2,}/g, '').replace(/\/{2,}/, '/');

        // Writes headers specified in config.json, sets statusCode = NaN
        for (const header in Config.default_headers) {
            res.setHeader(header, Config.default_headers[header]);
        }
        res.statusCode = NaN;

        writeLogs(req, res, logfile, 'requested');

        /* This prevents server from crashing
         * for paths containing %00, response is 'Bad Request'.
         */
        if (pathname.includes('%00')) {
            res.statusCode = 400;
            const error_msg = 'jshp server: error: the requested url is not valid\n'
                            + '    character 0 or \'%00\' is not allowed in requests';
            res.end(getHTMLerrMessage(error_msg));
            writeLogs(req, res, logfile, 'character 0 or \'%00\' is not allowed in requests');
            return;
        }

        /* If rewrite exist in Config, change pathname to rewritten name
         * This will cause the server to respond with data from the rewritten path
         */
        if (Config.rewriteList.includes(pathname)) {
            const rwrt = Config.rewrites[Config.rewriteList.indexOf(pathname)]
            pathname = rwrt.src || pathname;
            req.url = pathname + query_str;
        }

        /* If redirect exist in Config, change pathname to redirected name
         */
        else if (Config.redirectList.includes(pathname)) {
            const rdir = Config.redirects[Config.redirectList.indexOf(pathname)]
            pathname = rdir.src || pathname;
            res.statusCode = rdir.status || 300;
            res.setHeader('Location', pathname + query_str);
            res.end();
            req.url = pathname + query_str;
            writeLogs(req, res, logfile, 'redirected');
            return;
        }

        /* If path is jshpinfo, respond with data returned by 'nodejs-info' module.
         * The wierd backup of console.error is taken to hide the following error message:
         *
         * Handlebars: Access has been denied to resolve the property "headers" because it is not an "own property" of its parent.
         *     You can add a runtime option to disable the check or this warning:
         *     See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details.
         *
         * The error message comes from the 'handlebars' module, which is used by 'nodejs-info' module,
         * which inturn is used by this function. The error isn't anything serious.
         */
        if (pathname === '/jshpinfo' || pathname === '/jshpinfo/') {
            const console_error_bkp = console.error;
            console.error = function(): void {};
            res.statusCode = 200;
            res.end(require('nodejs-info')(req) + '<br>');
            console.error = console_error_bkp;
            writeLogs(req, res, logfile, 'jshpinfo');
            return;
        }

        // no_extension files
        if (!pathname.endsWith('/')) {
            for (const ext of Config.no_extension) {
                let possible_path = pathname + ext;
                if (FS.existsSync(resource_root + possible_path)) {
                    pathname = possible_path;
                    req.url = pathname + query_str;
                    break;
                }
            }
        }

        // always rewrites / to index value from Config
        if (pathname.endsWith('/')) {
            pathname += Config.index_file;
            req.url = pathname + query_str;
        }

        /* If requested path is blacklisted
         */
        if (Config.forbidden.includes(pathname)) {
            res.statusCode = 403;
            req.url = pathname + query_str;
            putHTTPError(req, res, resource_root, 'forbidden');
            return;
        }

        /* If requested path does not exist respond with 'Not Found'.
         */
        if (!FS.existsSync(resource_root + pathname)) {
            res.statusCode = 404;
            req.url = pathname + query_str;
            putHTTPError(req, res, resource_root, 'not found');
            return;
        }

        res.statusCode = 200;
        req.url = pathname + query_str;
        pathname = resource_root + pathname;
        pathname = pathname.replace(/\/{2,}/, '/');

        switch (req.method) {
            case 'GET': {
                GET(pathname, req, res);
                break;
            }
            case 'POST': {
                POST(pathname, req, res);
                break;
            }
            case 'PUT': {
                PUT(pathname, req, res);
                break;
            }
            case 'DELETE': {
                DELETE(pathname, req, res);
                break;
            }
            case 'OPTIONS': {
                OPTIONS(pathname, req, res);
                break;
            }
            default: {
                res.statusCode = 405;
                putHTTPError(req, res, resource_root, 'unsupported method');
                break;
            }
        }
    }).listen(port, function() {
        const log = `[${getLongDateTime()}] NodeJS JSHP Server (http://${host}:${port}) started`;
        console.log(log);
        if (logfile) FS.appendFile(logfile, log + '\n', function(error) {
            if (!error) return;
            console.trace(error);
            process.exit(1);
        });
    });
}
