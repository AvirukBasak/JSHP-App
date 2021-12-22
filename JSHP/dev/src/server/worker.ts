'use strict';

import * as WorkerThreads from 'worker_threads';
import * as HTTP from 'http';

import {
    VERSION,
    writeLogs,
    getHTMLerrMessage,
    string,
    number,
} from '../common/common';

// Initializes the static files server.
let CONFIG: NodeJS.Dict<any>;
let resource_root: string;
let logfile: string;

export const initWorker = function(config: NodeJS.Dict<any>) {
    CONFIG = config;
    resource_root = CONFIG.resource_root;
    logfile = CONFIG.log_path;
}

/**
 * Starts the parser in a seperate thread.
 * @param {HTTP.IncomingMessage} req The http request object. This object MUST contain 'method' and 'url' attributes.
 * @param {HTTP.ServerResponse} res The server response.
 */
export const startWorker = function(pathname: string, req: HTTP.IncomingMessage, res: HTTP.ServerResponse) {

    // Holds the messages and errors as HTML strings as returned by the thread.
    let response_body = '';

    // This is the data that is to be sent to the thread.
    const workerData = {
        resource_root,
        pathname,
        config: CONFIG,
        req: {
            url: req.url,
            method: req.method,
        }
    };

    const worker = new WorkerThreads.Worker(__dirname + '/../parser/parser.js', { workerData });
    let timed_out = false;

    // This timeout terminates the worker after 10s and echoes an error message.
    const timeout = setTimeout(function(): void {
        worker.terminate();
        timed_out = true;
        response_body += getHTMLerrMessage(
              'jshp server: error: jshp file error\n'
            + `    execution timed out after ${CONFIG.timeout_sec} seconds\n`
            + '    please check your jshp code for lengthy operations'
        );
    }, CONFIG.timeout_sec * 1000);

    // On message recieved from thread.
    worker.on('message', function(response: NodeJS.Dict<any>): void {
        for (const header in response.headers) {
            res.setHeader(header, response.headers[header]);
        }
        res.statusCode = response.statusCode;
        response_body += response.body;
    });

    // On error in thread.
    worker.on('error', function(error: Error): void {
        res.statusCode = 500;
        response_body += getHTMLerrMessage(string(error.stack));
    });

    // On worker exit, clear the 10s timeout.
    worker.on('exit', function(exitcode: number): void {
        clearTimeout(timeout);
        if (timed_out) {
            res.statusCode = 500;
            writeLogs(req, res, logfile, `parser timed out`);
        }
        else if (exitcode) writeLogs(req, res, logfile, `jshp error ${exitcode}`);
        else writeLogs(req, res, logfile, 'jshp');
        res.setHeader('Server', '@oogleglu/jshp ' + VERSION);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', response_body.length);
        res.end(response_body);
    });
}
