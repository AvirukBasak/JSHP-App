'use strict';

import * as HTTP from 'http';
import * as URL from 'url';
import * as FS from 'fs';

export const VERSION = 'v2021.12.20.15.00';

const object_history: NodeJS.Dict<any>[] = [];
/**
 * Removes functions from an object. The passed object will get modified.
 * @param {NodeJS.Dict<any>} obj The object from which functions are to be removed.
 * @return {NodeJS.Dict<any>}
 */
export const rmObjFunctions = function(obj: NodeJS.Dict<any>): NodeJS.Dict<any> {
    for (const key in obj) {
        if ((typeof obj[key]).toLowerCase() === 'function') obj[key] = null;
        else if ((typeof obj[key]).toLowerCase() === 'object') {
            if (object_history.indexOf(obj[key]) != -1) continue;
            object_history.push(obj[key]);
            rmObjFunctions(obj[key]);
        }
    }
    return obj;
}

/**
 * Returns current date and time.
 * @return {string}
 */
export const getLongDateTime = function(): string {
    const date_ob = new Date();
    const date    = ('0' + date_ob.getDate()).slice(-2);
    const month   = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    const year    = (''  + date_ob.getFullYear());
    const hours   = ('0' + date_ob.getHours()).slice(-2);
    const minute  = ('0' + date_ob.getMinutes()).slice(-2);
    const seconds = ('0' + date_ob.getSeconds()).slice(-2);
    return `${year}-${month}-${date} ${hours}:${minute}:${seconds}`;
}

/**
 * Returns an http error code for a given system error code.
 * @param {string} error
 * @return {number}
 */
export const sysErrToHTTPcode = function(error: any): number {
    const code = error.code;
    return (
        code === 'EACCES'  ? 401 :
        code === 'ENOTDIR' ? 401 :
        code === 'EISDIR'  ? 400 :
        code === 'ENOENT'  ? 404 :
        code === 'EPERM'   ? 401 : 500
    );
}

/**
 * Write logs to console.
 * @param {HTTP.IncomingMessage} req
 * @param {HTTP.ServerResponse} res
 * @param {string} logfile
 * @param {string} msg
 */
export const writeLogs = function(req: HTTP.IncomingMessage, res: HTTP.ServerResponse, logfile: string, msg: string): void {
    if (!req || !res) return;
    const client_ip = req?.connection?.remoteAddress
                   || req?.socket?.remoteAddress
                   || (req.headers['x-forwarded-for'] as string || '').replace(/,\s|,/g, ' -> ')
                   || 'client ip N/A';
    const log = `[${getLongDateTime()}] ${msg ? msg : ''}: ${client_ip} [${res.statusCode}]: ${req.method} ${req.url}`;
    console.log(log);
    if (logfile) FS.appendFile(logfile, log + '\n', function(error) {
        if (!error) return;
        console.trace(error);
        process.exit(1);
    });
}

/**
 * Takes a string and a color and returns an html message.
 * These messages normally report errors and warnings.
 * @param {string} str The message.
 * @param {string} color HTML color for the border.
 */
export const getHTMLmessage = function(str: string, color: string = 'dodgerblue'): string {
    return (
          '<head>'
        +     '<meta name="viewport" content="width=device-width, height=device-height">'
        + '</head>'
        + '<pre style="'
        +     'width: calc(100% - 30px);'
        +     'max-height: 50%;'
        +     `border: 1.5px solid ${color};`
        +     'border-radius: 5px;'
        +     'font-size: 0.8rem;'
        +     'line-height: 1.2rem;'
        +     'color: #333;'
        +     'background-color: #eee;'
        +     'display: block;'
        +     'margin: 20px auto 20px;'
        +     'padding: 10px;'
        +     'overflow: auto; ">'
        +     str
        + '</pre>'
    );
}

/**
 * Generates an error box in HTML from a string.
 * @param {string}
 */
export const getHTMLerrMessage = function(str: string): string {
    return getHTMLmessage(str, 'tomato');
}

/**
 * A pointless wrapper for Number().
 * @param {any} value The value to be converted to a number.
 * @return {number}
 */
export const number = (value?: any) => Number(value);

/**
 * A pointless wrapper for String().
 * @param {any} value The value to be converted to a string.
 * @return {string}
 */
export const string = (value?: any) => String(value);
