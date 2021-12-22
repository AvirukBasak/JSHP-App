'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const WorkerThreads = __importStar(require("worker_threads"));
const URL = __importStar(require("url"));
const FS = __importStar(require("fs"));
const common_1 = require("../common/common");
/**
 * Returns true if the type of the variable passed matches the regex.
 * @param {any} variable The variable
 * @param {NodeJS.RegExp} regex The regex to match the type of the variable
 * @return {boolean}
 */
const __testType = function (variable, regex) {
    return regex.test(typeof variable);
};
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
const $_QUERY_STRING = (function () {
    var _a, _b, _c;
    if (((_a = $_REQUEST.url) === null || _a === void 0 ? void 0 : _a.indexOf('?')) === -1)
        return '';
    else
        return ((_b = $_REQUEST.url) === null || _b === void 0 ? void 0 : _b.substring((_c = $_REQUEST.url) === null || _c === void 0 ? void 0 : _c.indexOf('?'))) || '';
})();
/**
 * Super global variable.
 * Stores GET query fields and values.
 * For duplicated values, an array of values is returned.
 * @type {NodeJS.Dict<any>}
 */
const $_GET = $_REQUEST.method === 'GET' ? URL.parse($_REQUEST.url, true).query : {};
/**
 * Super global variable.
 * Stores POST query fields and values.
 * For duplicated values, an array of values is returned.
 * @type {NodeJS.Dict<any>}
 */
const $_POST = $_REQUEST.method === 'POST' ? {} : {};
/**
 * Super global variable.
 * @type {NodeJS.Dict<any>}
 */
const $_SERVER = {
    'QUERY_STRING': $_QUERY_STRING,
    'REQUEST_METHOD': $_REQUEST.method,
    'REQUEST_URI': $_REQUEST_PATH,
};
/**
 * Super global variable.
 * Not yet implemented.
 * @type {NodeJS.Dict<any>}
 */
const $_SESSION = {};
/**
 * Super global variable.
 * Not yet implemented.
 * @type {NodeJS.Dict<any>}
 */
const $_COOKIES = {};
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
const $_HEADERS = {};
// needed variables for evaluation
let __OUTPUT_BUFFER__ = '';
/**
 * Writes headers to the super global variable.
 * @param {string} key
 * @param {string} value
 */
const set_header = function (key, value) {
    if (!__testType(key, /string/i))
        throw new TypeError('key should be of type string');
    if (!__testType(value, /string/i))
        throw new TypeError('value should be of type string');
    $_HEADERS[key] = value;
};
/**
 * Echoes a string.
 * @param {string} str text/HTML string to echo.
 */
const echo = function (str) {
    if (!__testType(str, /string/i))
        throw new TypeError('str should be of type string');
    if (str)
        __OUTPUT_BUFFER__ += str.substring(0, str.length - 1) + (str[str.length - 1] === '\n' ? '<br>' : str[str.length - 1]);
    return str;
};
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
    echo: function (str, color) {
        if (!__testType(str, /string/i))
            throw new TypeError('str should be of type string');
        return echo((0, common_1.getHTMLmessage)(str, color));
    },
    /**
     * Shows a message highlighted by a 'tomato' colored border.
     * @param {string} str Message.
     * @return {string} HTML string enclosed within a <pre>..
     */
    error: function (str) {
        if (!__testType(str, /string/i))
            throw new TypeError('str should be of type string');
        $_STATUS_CODE = 500;
        return this.echo(str, 'tomato');
    }
};
const Cookie = {
    /**
     * Get a cookie from request.
     */
    get: function (name) {
        if (!__testType(name, /string/i))
            throw new TypeError('name should be of type string');
        return '';
    },
    /**
     * Set a cookie to a response.
     */
    set: function (name, value) {
        if (!__testType(name, /string/i))
            throw new TypeError('name should be of type string');
        if (!__testType(value, /string/i))
            throw new TypeError('value should be of type string');
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
    read: function (file, callback) {
        if (!__testType(file, /string/i))
            throw new TypeError('file should be of type string');
        if (!__testType(callback, /function|undefined/i))
            throw new TypeError('callback should be of type function');
        if ((typeof file).toLowerCase() === 'string') {
            if (!file.startsWith($_RES_ROOT))
                file = $_RES_ROOT + '/' + file;
        }
        try {
            const data = FS.readFileSync(file);
            return data;
        }
        catch (error) {
            if (callback) {
                callback(error);
                return null;
            }
            Message.error('jshp parser: read_file: jshp file error\n'
                + error.stack);
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
    write: function (file, data, options, callback) {
        if (!__testType(file, /string/i))
            throw new TypeError('file should be of type string');
        if (!__testType(data, /Buffer/i))
            throw new TypeError('data should be of type Buffer');
        if (!__testType(callback, /function|undefined/i))
            throw new TypeError('callback should be of type function');
        if ((typeof file).toLowerCase() === 'string') {
            if (!file.startsWith($_RES_ROOT))
                file = $_RES_ROOT + '/' + file;
        }
        if (!options)
            options.flag = 'a';
        if (!callback)
            callback = function (error) {
                Message.error('jshp parser: write_file: jshp file error\n'
                    + error.stack);
                $_STATUS_CODE = 500;
            };
        FS.writeFile(file, data, options, callback);
    }
};
/**
 * Parses JavaScript code within JSHP tags.
 * @return {NodeJS.Dict<any>} An object containing response statusCode, headers, and body.
 */
const jshpParse = function () {
    // validating parameters
    if (!$_REQUEST)
        throw 'jshp parser: error: no $_REQUEST passed';
    if (!$_REQUEST.url)
        throw 'jshp parser: error: $_REQUEST has no url';
    if (!$_REQUEST.method)
        throw 'jshp parser: error: $_REQUEST has no method';
    if (!$_RES_ROOT)
        throw 'jshp parser: error: server resources path not passed';
    let __RAW_CODE__ = '';
    let __EVAL_BUFFER__ = [];
    let __postParse_EVAL_BUFFER__ = [];
    try {
        __RAW_CODE__ = (0, common_1.string)(FS.readFileSync($_REQUEST_PATH));
    }
    catch (error) {
        Message.error(error.stack || '');
        $_STATUS_CODE = (0, common_1.sysErrToHTTPcode)(error);
        return {
            statusCode: $_STATUS_CODE,
            headers: $_HEADERS,
            body: __OUTPUT_BUFFER__
        };
    }
    // Splitting file into codes and non-codes
    __EVAL_BUFFER__ = __RAW_CODE__.split(/<script class="jshp">|<\/script jshp>/iu);
    /*
     * From this point onrwards, even indexes will contain null or HTML and odd indexes will contain executable script.
     * Even indexes are untouched.
     * Result of the executed script will be stored back in the script index.
     * After all execution completed, the array will be joined back to a string and returned as a response.
     */
    // Joining non-codes with codes using echo
    for (let i = 0; i < __EVAL_BUFFER__.length; i++) {
        if (i % 2 === 0) {
            __postParse_EVAL_BUFFER__.push('echo(`'
                + __EVAL_BUFFER__[i].replace(/%/g, '%25')
                    .replace(/`/g, '%60')
                    .replace(/\$\{/g, '%24%7B')
                    .replace(/<\?/g, '${')
                    .replace(/\?>/g, '}')
                + '`)');
        }
        else
            __postParse_EVAL_BUFFER__.push(__EVAL_BUFFER__[i]);
    }
    try {
        eval(__postParse_EVAL_BUFFER__.join('; '));
    }
    catch (error) {
        // complicated error reporting system for providing proper file name and line numbers
        Message.error('jshp parser: eval: jshp file error\n'
            + (0, common_1.string)(error.stack)
                .replace(new RegExp(__dirname + '/', 'g'), '')
                .replace(/\s{4}at\seval\s\(eval\sat\sjshpParse\s\(parser\.js:\d+:\d+\),\s/g, '    in JSHP file (' + $_REQUEST.url.split('?')[0]));
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
};
(_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage(jshpParse());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGV2L3NyYy9wYXJzZXIvcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUViLDhEQUFnRDtBQUVoRCx5Q0FBMkI7QUFDM0IsdUNBQXlCO0FBRXpCLDZDQVEwQjtBQUUxQjs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxHQUFHLFVBQVMsUUFBYSxFQUFFLEtBQWE7SUFDcEQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sUUFBUSxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFBO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztBQUVqRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRTFGOzs7R0FHRztBQUNILE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO0FBRS9DOzs7R0FHRztBQUNILE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO0FBRXpEOzs7R0FHRztBQUNILE1BQU0sY0FBYyxHQUFXLENBQUM7O0lBQzVCLElBQUksQ0FBQSxNQUFBLFNBQVMsQ0FBQyxHQUFHLDBDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBSyxDQUFDLENBQUM7UUFBRSxPQUFPLEVBQUUsQ0FBQzs7UUFDN0MsT0FBTyxDQUFBLE1BQUEsU0FBUyxDQUFDLEdBQUcsMENBQUUsU0FBUyxDQUFDLE1BQUEsU0FBUyxDQUFDLEdBQUcsMENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUksRUFBRSxDQUFDO0FBQzVFLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTDs7Ozs7R0FLRztBQUNILE1BQU0sS0FBSyxHQUFxQixTQUFTLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRXZHOzs7OztHQUtHO0FBQ0gsTUFBTSxNQUFNLEdBQXFCLFNBQVMsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUV2RTs7O0dBR0c7QUFDSCxNQUFNLFFBQVEsR0FBcUI7SUFDL0IsY0FBYyxFQUFFLGNBQWM7SUFDOUIsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLE1BQU07SUFDbEMsYUFBYSxFQUFFLGNBQWM7Q0FDaEMsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxNQUFNLFNBQVMsR0FBcUIsRUFBRSxDQUFDO0FBRXZDOzs7O0dBSUc7QUFDSCxNQUFNLFNBQVMsR0FBcUIsRUFBRSxDQUFDO0FBRXZDOzs7O0dBSUc7QUFDSCxJQUFJLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFFeEI7Ozs7R0FJRztBQUNILE1BQU0sU0FBUyxHQUFxQixFQUFFLENBQUM7QUFFdkMsa0NBQWtDO0FBQ2xDLElBQUksaUJBQWlCLEdBQVcsRUFBRSxDQUFDO0FBRW5DOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsR0FBRyxVQUFTLEdBQVcsRUFBRSxLQUFhO0lBQ2xELElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQztRQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNyRixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7UUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDekYsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUMzQixDQUFDLENBQUE7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLElBQUksR0FBRyxVQUFTLEdBQVc7SUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDO1FBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQ3JGLElBQUksR0FBRztRQUFFLGlCQUFpQixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvSCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMsQ0FBQTtBQUVEOzs7R0FHRztBQUNILE1BQU0sT0FBTyxHQUFHO0lBRVo7Ozs7O09BS0c7SUFDSCxJQUFJLEVBQUUsVUFBUyxHQUFXLEVBQUUsS0FBYTtRQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7WUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDckYsT0FBTyxJQUFJLENBQUMsSUFBQSx1QkFBYyxFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxFQUFFLFVBQVMsR0FBVztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7WUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDckYsYUFBYSxHQUFHLEdBQUcsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDSixDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUc7SUFFWDs7T0FFRztJQUNILEdBQUcsRUFBRSxVQUFTLElBQVk7UUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO1lBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ3ZGLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsR0FBRyxFQUFFLFVBQVMsSUFBWSxFQUFFLEtBQWE7UUFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO1lBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztZQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUM3RixDQUFDO0NBQ0osQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSxJQUFJLEdBQUc7SUFFVDs7Ozs7O09BTUc7SUFDSCxJQUFJLEVBQUUsVUFBUyxJQUFZLEVBQUUsUUFBK0I7UUFDeEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO1lBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLHFCQUFxQixDQUFDO1lBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQzdHLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsRUFBRTtZQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7Z0JBQUUsSUFBSSxHQUFHLFVBQVUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ3BFO1FBQ0QsSUFBSTtZQUNBLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsUUFBUSxDQUFDLEtBQWMsQ0FBQyxDQUFDO2dCQUN6QixPQUFPLElBQUksQ0FBQzthQUNmO1lBQ0QsT0FBTyxDQUFDLEtBQUssQ0FDUiwyQ0FBMkM7a0JBQzFDLEtBQWUsQ0FBQyxLQUFLLENBQzFCLENBQUM7WUFDRixhQUFhLEdBQUcsR0FBRyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUssRUFBRSxVQUFTLElBQVksRUFBRSxJQUFZLEVBQUUsT0FBWSxFQUFFLFFBQWdDO1FBQ3RGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztZQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUN2RixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUM7WUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUscUJBQXFCLENBQUM7WUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDN0csSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxFQUFFO1lBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztnQkFBRSxJQUFJLEdBQUcsVUFBVSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDcEU7UUFDRCxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU8sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRO1lBQUUsUUFBUSxHQUFHLFVBQVMsS0FBSztnQkFDckMsT0FBTyxDQUFDLEtBQUssQ0FDUCw0Q0FBNEM7c0JBQzVDLEtBQUssQ0FBQyxLQUFLLENBQ2YsQ0FBQztnQkFDRixhQUFhLEdBQUcsR0FBRyxDQUFDO1lBQ3hCLENBQUMsQ0FBQTtRQUNELEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBOEIsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7Q0FDSixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxTQUFTLEdBQUc7SUFFZCx3QkFBd0I7SUFDeEIsSUFBSSxDQUFDLFNBQVM7UUFBRyxNQUFNLHlDQUF5QyxDQUFDO0lBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRztRQUFFLE1BQU0sMENBQTBDLENBQUM7SUFDckUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO1FBQUUsTUFBTSw2Q0FBNkMsQ0FBQztJQUMzRSxJQUFJLENBQUMsVUFBVTtRQUFFLE1BQU0sc0RBQXNELENBQUM7SUFFOUUsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO0lBQzlCLElBQUksZUFBZSxHQUFhLEVBQUUsQ0FBQztJQUNuQyxJQUFJLHlCQUF5QixHQUFhLEVBQUUsQ0FBQztJQUU3QyxJQUFJO1FBQ0EsWUFBWSxHQUFHLElBQUEsZUFBTSxFQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztLQUMxRDtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ1osT0FBTyxDQUFDLEtBQUssQ0FBRSxLQUFlLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLGFBQWEsR0FBRyxJQUFBLHlCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE9BQU87WUFDSCxVQUFVLEVBQUUsYUFBYTtZQUN6QixPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsaUJBQWlCO1NBQzFCLENBQUM7S0FDTDtJQUVELDBDQUEwQztJQUMxQyxlQUFlLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FDaEMseUNBQXlDLENBQzVDLENBQUM7SUFFRjs7Ozs7T0FLRztJQUVILDBDQUEwQztJQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2IseUJBQXlCLENBQUMsSUFBSSxDQUN4QixRQUFRO2tCQUNSLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztxQkFDcEIsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7cUJBQ3BCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO3FCQUMxQixPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztxQkFDckIsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7a0JBQ3ZDLElBQUksQ0FDVCxDQUFDO1NBQ0w7O1lBQ0kseUJBQXlCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNEO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUM5QztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ1oscUZBQXFGO1FBQ3JGLE9BQU8sQ0FBQyxLQUFLLENBQ1Asc0NBQXNDO2NBQ3RDLElBQUEsZUFBTSxFQUFFLEtBQWUsQ0FBQyxLQUFLLENBQUM7aUJBQzFCLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQztpQkFDN0MsT0FBTyxDQUNILGtFQUFrRSxFQUNsRSxvQkFBb0IsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDdEQsQ0FDVCxDQUFDO1FBQ0YsYUFBYSxHQUFHLEdBQUcsQ0FBQztLQUN2QjtJQUVELGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO1NBQ3hCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO1NBQ3BCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFM0QsT0FBTztRQUNILFVBQVUsRUFBRSxhQUFhO1FBQ3pCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLElBQUksRUFBRSxpQkFBaUI7S0FDMUIsQ0FBQztBQUNOLENBQUMsQ0FBQTtBQUVELE1BQUEsYUFBYSxDQUFDLFVBQVUsMENBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMifQ==