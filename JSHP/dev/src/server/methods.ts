'use strict';

import * as N_Static from 'node-static';
import * as HTTP from 'http';
import * as URL from 'url';
import * as FS from 'fs';

import {
    writeLogs,
    getHTMLerrMessage,
    string,
} from '../common/common';
import { initWorker, startWorker } from './worker';

// Initializes the static files server.
let CONFIG: NodeJS.Dict<any>;
let resource_root: string;
let logfile: string;
let NodeStaticServer: N_Static.Server;

export const initMethods = function(config: NodeJS.Dict<any>) {
    CONFIG = config;
    resource_root = CONFIG.resource_root;
    logfile = CONFIG.log_path;
    NodeStaticServer = new N_Static.Server(resource_root);
    initWorker(CONFIG);
}

export const GET = function(pathname: string, req: HTTP.IncomingMessage, res: HTTP.ServerResponse) {

    /* If a jshp file is requested parse it and respond with the result.
     */
    if ((function() {
        for (const ext of CONFIG.exec_extensions) if (pathname.endsWith(ext)) return true;
        return false;
    })()) try {
        // Executes the pasrer and hence the JSHP code in a seperate thread.
        startWorker(pathname, req, res);
        return;
    } catch (error) {
        res.statusCode = 500;
        res.end(getHTMLerrMessage(string((error as Error).stack)));
        writeLogs(req, res, logfile, string(error as Error));
        return;
    }

    // Serves static files, i.e. files that cannot be executed.
    NodeStaticServer.serve(req, res);

    writeLogs(req, res, logfile, 'node-static');
}

export const POST = function(pathname: string, req: HTTP.IncomingMessage, res: HTTP.ServerResponse) {
    res.statusCode = 405;
    res.end();
}

export const PUT = function(pathname: string, req: HTTP.IncomingMessage, res: HTTP.ServerResponse) {
    res.statusCode = 405;
    res.end();
}

export const DELETE = function(pathname: string, req: HTTP.IncomingMessage, res: HTTP.ServerResponse) {
    res.statusCode = 405;
    res.end();
}

export const OPTIONS = function(pathname: string, req: HTTP.IncomingMessage, res: HTTP.ServerResponse) {
    res.statusCode = 405;
    res.end();
}
