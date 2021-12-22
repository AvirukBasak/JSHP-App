'use strict';

import * as WorkerThreads from 'worker_threads';
import * as HTTP from 'http';
import * as URL from 'url';
import * as FS from 'fs';

import {
     VERSION,
     getLongDateTime,
     sysErrToHTTPcode,
     writeLogs,
     getHTMLmessage,
     string,
     number,
} from '../common/common';

/**
 * Returns true if the type of the variable passed matches the regex.
 * @param {any} variable The variable
 * @param {NodeJS.RegExp} regex The regex to match the type of the variable
 * @return {boolean}
 */
const __testType = function(variable: any, regex: RegExp): boolean {
    return regex.test(typeof variable);
}

/**
 * Super global variable.
 * Stores OS environment variables.
 * Only holds those variables that were added to the environment before the parser was called.
 * @type {NodeJS.ProcessEnv}
 */
const $_ENV = process.env;

/**
 * Super global variable.
 * Holds configuration data from config.json file.
 * @type {NodeJS.Dict<any>}
 */
const $_CONFIG = WorkerThreads.workerData.config;

/**
 * Suoer global variable.
 * Stores the directory from where server is serving resources.
 * @type {string}
 */
const $_RES_ROOT = (WorkerThreads.workerData.resource_root + '/').replace(/\/{2,}/g, '/');

/**
 * Stores request data.
 * @param {HTTP.IncomingMessage} $_REQUEST The HTTP $_REQUESTuest object. This object MUST contain 'method' and 'url' attributes.
 */
const $_REQUEST = WorkerThreads.workerData.req;

/**
 * Path to requested resource.
 * @param {string} $_REQUEST_PATH Path of resource
 */
const $_REQUEST_PATH = WorkerThreads.workerData.pathname;

/**
 * Requested query string
 * @param {string} $_QUERY_STRING
 */
const $_QUERY_STRING: string = (function(): string {
    if ($_REQUEST.url?.indexOf('?') === -1) return '';
    else return $_REQUEST.url?.substring($_REQUEST.url?.indexOf('?')) || '';
})();

/**
 * Super global variable.
 * Stores GET query fields and values.
 * For duplicated values, an array of values is returned.
 * @type {NodeJS.Dict<any>}
 */
const $_GET: NodeJS.Dict<any> = $_REQUEST.method === 'GET' ? URL.parse($_REQUEST.url, true).query : {};

/**
 * Super global variable.
 * Stores POST query fields and values.
 * For duplicated values, an array of values is returned.
 * @type {NodeJS.Dict<any>}
 */
const $_POST: NodeJS.Dict<any> = $_REQUEST.method === 'POST' ? {} : {};

/**
 * Super global variable.
 * @type {NodeJS.Dict<any>}
 */
const $_SERVER: NodeJS.Dict<any> = {
    'QUERY_STRING': $_QUERY_STRING,
    'REQUEST_METHOD': $_REQUEST.method,
    'REQUEST_URI': $_REQUEST_PATH,
};

/**
 * Super global variable.
 * Not yet implemented.
 * @type {NodeJS.Dict<any>}
 */
const $_SESSION: NodeJS.Dict<any> = {};

/**
 * Super global variable.
 * Not yet implemented.
 * @type {NodeJS.Dict<any>}
 */
const $_COOKIES: NodeJS.Dict<any> = {};

/**
 * Super global variable.
 * Stores response status.
 * @type {number}
 */
let $_STATUS_CODE = 200;

/**
 * Super global variable.
 * Stores headers.
 * @type {NodeJS.Dict<any>}
 */
const $_HEADERS: NodeJS.Dict<any> = {};

// needed variables for evaluation
let __OUTPUT_BUFFER__: string = '';

/**
 * Writes headers to the super global variable.
 * @param {string} key
 * @param {string} value
 */
const set_header = function(key: string, value: string): void {
    if (!__testType(key, /string/i)) throw new TypeError('key should be of type string');
    if (!__testType(value, /string/i)) throw new TypeError('value should be of type string');
    $_HEADERS[key] = value;
}

/**
 * Echoes a string.
 * @param {string} str text/HTML string to echo.
 */
const echo = function(str: string): string {
    if (!__testType(str, /string/i)) throw new TypeError('str should be of type string');
    if (str) __OUTPUT_BUFFER__ += str.substring(0, str.length - 1) + (str[str.length - 1] === '\n' ? '<br>' : str[str.length - 1]);
    return str;
}

/**
 * Displays a message, some text in a <pre>, with a rounded border.
 * Functions: Message.echo() & Message.error()
 */
const Message = {

    /**
     * Shows a message highlighted by a colored border.
     * @param {string} str Message.
     * @param {string} color Border color.
     * @return {string} HTML string enclosed within a <pre>.
     */
    echo: function(str: string, color: string): string {
        if (!__testType(str, /string/i)) throw new TypeError('str should be of type string');
        return echo(getHTMLmessage(str, color));
    },

    /**
     * Shows a message highlighted by a 'tomato' colored border.
     * @param {string} str Message.
     * @return {string} HTML string enclosed within a <pre>..
     */
    error: function(str: string): string {
        if (!__testType(str, /string/i)) throw new TypeError('str should be of type string');
        $_STATUS_CODE = 500;
        return this.echo(str, 'tomato');
    }
};

const Cookie = {

    /**
     * Get a cookie from request.
     */
    get: function(name: string): string {
        if (!__testType(name, /string/i)) throw new TypeError('name should be of type string');
        return '';
    },

    /**
     * Set a cookie to a response.
     */
    set: function(name: string, value: string) {
        if (!__testType(name, /string/i)) throw new TypeError('name should be of type string');
        if (!__testType(value, /string/i)) throw new TypeError('value should be of type string');
    }
};

/**
 * Functions: File.read(path, callback) and File.write(path, buffer, callback)
 */
const File = {
    
    /**
     * Reads a file and returns the data.
     * This function reads files synchronously.
     * @param {string} file URL or path to file
     * @param {(error: Error) => any} callback(error) Optional. The function to run if an error occurs when reading. By default, error will appear on the page as an error message.
     * @return {Buffer | null}
     */
    read: function(file: string, callback: (error: Error) => any): Buffer | null {
        if (!__testType(file, /string/i)) throw new TypeError('file should be of type string');
        if (!__testType(callback, /function|undefined/i)) throw new TypeError('callback should be of type function');
        if ((typeof file).toLowerCase() === 'string') {
            if (!file.startsWith($_RES_ROOT)) file = $_RES_ROOT + '/' + file;
        }
        try {
            const data = FS.readFileSync(file);
            return data;
        } catch (error) {
            if (callback) {
                callback(error as Error);
                return null;
            }
            Message.error(
                 'jshp parser: read_file: jshp file error\n'
               + (error as Error).stack
            );
            $_STATUS_CODE = 500;
        }
        return null;
    },
    
    /**
     * Writes a file asynchronously. If file exists, data will get appended by default.
     * @param {string} file URL or path to file.
     * @param {Buffer} data Data to write.
     * @param {NodeJS.Dict<any>} options Write options object.
     * @param {(error: Error) => void} callback(error) Optional. The function to run if an error occurs when writing. By default, error will appear on the page as an error message.
     */
    write: function(file: string, data: Buffer, options: any, callback: (error: Error) => void): void {
        if (!__testType(file, /string/i)) throw new TypeError('file should be of type string');
        if (!__testType(data, /Buffer/i)) throw new TypeError('data should be of type Buffer');
        if (!__testType(callback, /function|undefined/i)) throw new TypeError('callback should be of type function');
        if ((typeof file).toLowerCase() === 'string') {
            if (!file.startsWith($_RES_ROOT)) file = $_RES_ROOT + '/' + file;
        }
        if (!options) options.flag = 'a';
        if (!callback) callback = function(error): void {
           Message.error(
                 'jshp parser: write_file: jshp file error\n'
               + error.stack
            );
            $_STATUS_CODE = 500;
        }
        FS.writeFile(file, data, options, callback as FS.NoParamCallback);
    }
};

/**
 * Parses JavaScript code within JSHP tags.
 * @return {NodeJS.Dict<any>} An object containing response statusCode, headers, and body.
 */
const jshpParse = function(): NodeJS.Dict<any> {

    // validating parameters
    if (!$_REQUEST)  throw 'jshp parser: error: no $_REQUEST passed';
    if (!$_REQUEST.url) throw 'jshp parser: error: $_REQUEST has no url';
    if (!$_REQUEST.method) throw 'jshp parser: error: $_REQUEST has no method';
    if (!$_RES_ROOT) throw 'jshp parser: error: server resources path not passed';

    let __RAW_CODE__: string = '';
    let __EVAL_BUFFER__: string[] = [];
    let __postParse_EVAL_BUFFER__: string[] = [];

    try {
        __RAW_CODE__ = string(FS.readFileSync($_REQUEST_PATH));
    } catch (error) {
        Message.error((error as Error).stack || '');
        $_STATUS_CODE = sysErrToHTTPcode(error);
        return {
            statusCode: $_STATUS_CODE,
            headers: $_HEADERS,
            body: __OUTPUT_BUFFER__
        };
    }

    // Splitting file into codes and non-codes
    __EVAL_BUFFER__ = __RAW_CODE__.split(
        /<script class="jshp">|<\/script jshp>/iu
    );

    /*
     * From this point onrwards, even indexes will contain null or HTML and odd indexes will contain executable script.
     * Even indexes are untouched.
     * Result of the executed script will be stored back in the script index.
     * After all execution completed, the array will be joined back to a string and returned as a response.
     */

    // Joining non-codes with codes using echo
    for (let i = 0; i < __EVAL_BUFFER__.length; i++) {
        if (i % 2 === 0) {
            __postParse_EVAL_BUFFER__.push(
                  'echo(`'
                + __EVAL_BUFFER__[i].replace(/%/g, '%25')
                                    .replace(/`/g, '%60')
                                    .replace(/\$\{/g, '%24%7B')
                                    .replace(/<\?/g, '${')
                                    .replace(/\?>/g, '}')
                + '`)'
            );
        }
        else __postParse_EVAL_BUFFER__.push(__EVAL_BUFFER__[i]);
    }

    try {
        eval(__postParse_EVAL_BUFFER__.join('; '));
    } catch (error) {
        // complicated error reporting system for providing proper file name and line numbers
        Message.error(
              'jshp parser: eval: jshp file error\n'
            + string((error as Error).stack)
                 .replace(new RegExp(__dirname + '/', 'g'), '')
                 .replace(
                      /\s{4}at\seval\s\(eval\sat\sjshpParse\s\(parser\.js:\d+:\d+\),\s/g,
                      '    in JSHP file (' + $_REQUEST.url.split('?')[0]
                 )
        );
        $_STATUS_CODE = 500;
    }

    __OUTPUT_BUFFER__ = __OUTPUT_BUFFER__.replace(/%24%7B/g, '${')
                                         .replace(/%60/g, '`')
                                         .replace(/%25/g, '%');

    return {
        statusCode: $_STATUS_CODE,
        headers: $_HEADERS,
        body: __OUTPUT_BUFFER__
    };
}

WorkerThreads.parentPort?.postMessage(jshpParse());
